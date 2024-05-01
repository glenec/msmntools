"""
Requirements: config.py import containing relevant settings
"""
from flask import Flask, jsonify, request, send_from_directory
from helpers import combined_costco, combined_amazon, combined_manifest, get_parts_international_costco_results, get_parts_international_costco, search_international_costcos, search_international_costco_extract
from flask_sqlalchemy import SQLAlchemy
import os
import config

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = config.postgres_uri
app.secret_key = config.app_secret_key
db = SQLAlchemy(app)

@app.route('/image/<path:filename>', methods=['GET'])
def serve_image(filename):
    """
    Serves an image from the filesystem based on a provided filename path.
    
    Args:
        filename (str): The path to the image file to be served.
    
    Returns:
        A Flask response object containing the image file.
    """
    return send_from_directory(os.path.dirname(filename), os.path.basename(filename))

@app.route('/costco/search', methods=['GET'])
def search():
    """
    Searches for parts in the Costco inventory database based on a query parameter.
    
    Parameters are received via query string:
        query (str): The search term to query in the database.
    
    Returns:
        JSON: A list of dictionaries each containing part_number, description, and image URL of the parts found.
    """
    query = request.args.get('query')
    results = combined_costco(query, db)
    return jsonify([{
        'part_number': item[0],
        'description': item[1],
        'image': item[2]
    } for item in results])


@app.route('/amazon/search', methods=['GET'])
def amazon_search():
    """
    Searches for parts in the Amazon inventory database based on a query parameter.
    
    Parameters are received via query string:
        query (str): The search term to query in the database.
    
    Returns:
        JSON: A list of dictionaries each containing part_number, description, and image URL of the parts found.
    """
    query = request.args.get('query')
    results = combined_amazon(query, db)
    
    return jsonify([{
        'part_number': item[0],
        'description': item[1],
        'image': item[2]
    } for item in results])


@app.route('/costco_manifest/search', methods=['GET'])
def costco_manifest_search():
    """
    Searches for parts in the Costco manifest based on a query parameter.
    
    Parameters are received via query string:
        query (str): The search term to query in the manifest.
    
    Returns:
        JSON: A list of dictionaries each containing part_number, description, price, and date of the parts found.
    """

    query = request.args.get('query')
    results = combined_manifest(query, db)

    return jsonify([{
        'part_number': item[0],
        'description': item[1],
        'price': item[2], 
        'date': item[3]
    } for item in results])


@app.route('/hidden_costco/search', methods=['GET'])
def hidden_search():
    """
    Performs an in-depth search across various international Costco databases based on a query parameter.
    
    Parameters are received via query string:
        query (str): The search term to query in the databases.
    
    Returns:
        JSON: A list of results from multiple Costco regions, consolidating various item details into a unified response.
    """
    parts = request.args.get('query')
    results = []

    for region, settings in config.costco_settings:
        json_response = search_international_costcos(parts, **settings)
        region_results = search_international_costco_extract(json_response, region)
        results.extend(region_results)


    for country, settings in config.international_costco_part_settings:
        json_response = get_parts_international_costco(parts, country, **settings)
        country_results = get_parts_international_costco_results(json_response, country)
        results.extend(country_results)
    
    return jsonify(results)

