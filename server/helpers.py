from sqlalchemy import text
import requests
import urllib.parse

def combined_costco(query, db):
    """
    Retrieves product data from the Costco database using a combination of direct matches and broader description searches.
    
    Args:
        query (str): The search keyword used to find products.
        db (Database Connection): The database connection object.
    
    Yields:
        tuple: Each tuple contains part_number, description, and image_path of each matching product.
    """
    with db.engine.connect() as connection:
        for row in connection.execute(
                text("SELECT p.part_number, p.description, i.image_path FROM product p, images i WHERE i.part_number = p.part_number AND p.part_number ILIKE :search_query || '%' ORDER BY p.part_number ASC").bindparams(search_query=query)
            ).fetchall():
                yield row
        terms = query.split()
        search_conditions = ' AND '.join([f"(p.description ILIKE '%%' || :term{i} || '%%')" for i, term in enumerate(terms)])
        sql = f"""
            SELECT p.part_number, p.description, i.image_path 
            FROM product p, images i 
            WHERE i.part_number = p.part_number 
            AND ({search_conditions})
            ORDER BY p.part_number ASC;
        """
        params = {f"term{i}": term for i, term in enumerate(terms)}
        results = connection.execute(text(sql).bindparams(**params)).fetchall()
        for row in results:
            yield row

def combined_amazon(query, db):
    """
    Retrieves product data from the Amazon database using a combination of direct matches and broader description searches.
    
    Args:
        query (str): The search keyword used to find products.
        db (Database Connection): The database connection object.
    
    Yields:
        tuple: Each tuple contains part_number, description, and image_path of each matching product.
    """
    with db.engine.connect() as connection:
        for row in connection.execute(
                text("SELECT p.part_number, p.description, i.image_path FROM amazon_product p, amazon_images i WHERE i.part_number = p.part_number AND p.part_number ILIKE :search_query || '%' ORDER BY p.part_number ASC").bindparams(search_query=query)
            ).fetchall():
                yield row
        terms = query.split()
        search_conditions = ' AND '.join([f"(p.description ILIKE '%%' || :term{i} || '%%')" for i, term in enumerate(terms)])
        sql = f"""
            SELECT p.part_number, p.description, i.image_path 
            FROM amazon_product p, amazon_images i 
            WHERE i.part_number = p.part_number 
            AND ({search_conditions})
            ORDER BY p.part_number ASC;
        """
        params = {f"term{i}": term for i, term in enumerate(terms)}
        results = connection.execute(text(sql).bindparams(**params)).fetchall()
        for row in results:
            yield row

def combined_manifest(query, db):
    """
    Retrieves manifest data based on a combination of direct item number matches and broader description searches.
    
    Args:
        query (str): The search keyword used to find manifest items.
        db (Database Connection): The database connection object.
    
    Yields:
        tuple: Each tuple contains manifest item number, description, price, and last received date of each matching item.
    """

    with db.engine.connect() as connection:
        for row in connection.execute(text("""
                 SELECT manifest_item_number, manifest_description, manifest_price, manifest_last_received
                 FROM manifest
                 WHERE
                 manifest_item_number ILIKE :search_query || '%'
                 ORDER BY
                 manifest_item_number ASC
                 """).bindparams(search_query=query)
            ).fetchall():
                yield row
        terms = query.split()
        search_conditions = ' AND '.join([f"(manifest_description ILIKE '%%' || :term{i} || '%%')" for i, term in enumerate(terms)])
        sql = f"""
            SELECT manifest_item_number, manifest_description, manifest_price, manifest_last_received
            FROM manifest
            WHERE manifest_item_number = manifest_item_number 
            AND ({search_conditions})
            ORDER BY manifest_item_number ASC;
        """
        params = {f"term{i}": term for i, term in enumerate(terms)}
        results = connection.execute(text(sql).bindparams(**params)).fetchall()
        for row in results:
            yield row


def search_international_costcos(parts, passkey, locale):
    """
    Queries international Costco databases for products using API settings specific to each region.
    
    Args:
        parts (str): The search term for product parts.
        passkey (str): The API passkey specific to the region.
        locale (str): The locale setting for the API call.
    
    Returns:
        dict: A JSON response containing product search results.
    """
    url = f"https://api.bazaarvoice.com/data/products.json?passkey={passkey}&locale={locale}&allowMissing=true&apiVersion=5.4&search={urllib.parse.quote(parts, safe='')}&limit=50"
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    response = requests.request("GET", url, headers=headers)
    return response.json()

def search_international_costco_extract(json_response, region):
    """
    Extracts product data from a JSON response based on the region's specific data availability.
    
    Args:
        json_response (dict): The JSON response containing the product search results.
        region (str): The region code that determines how to parse the data.
    
    Returns:
        list: A list of dictionaries containing extracted product information.
    """
    results = []
    if 'Results' in json_response and len(json_response['Results']) != 0:
        for item_result in json_response['Results']:
            item_name = item_result.get("Name")
            image = item_result.get("ImageUrl")
            page_url = item_result.get("ProductPageUrl")
            
            if region == 'USA' or region == 'Canada':
                item_code = "Error"  # Default if no model number
                if 'ModelNumbers' in item_result and len(item_result['ModelNumbers']) != 0:
                    item_code = item_result['ModelNumbers'][0]
            else:
                item_code = item_result.get("Id", "Error")

            results.append({
                'item_name': item_name,
                'image': image,
                'page_url': page_url,
                'item_code': item_code
            })
    return results

def get_parts_international_costco(parts, passkey, locale, filter_type="id"):
    """
    Fetches parts information from international Costco databases using API calls with region-specific settings.
    
    Args:
        parts (str): The part identifier to search for.
        passkey (str): The API passkey.
        locale (str): The locale setting for the API call.
        filter_type (str): Type of filter used for the search, typically 'id'.
    
    Returns:
        dict: A JSON response containing parts search results.
    """
    base_url = "https://api.bazaarvoice.com/data/products.json"
    params = {
        "passkey": passkey,
        "locale": locale,
        "allowMissing": "true",
        "apiVersion": "5.4",
        "filter": f"{filter_type}:{urllib.parse.quote(parts)}",
        "limit": "50"
    }
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    response = requests.get(base_url, headers=headers, params=params)
    return response.json()

def get_parts_international_costco_results(json_response, country):
    """
    Processes the first result from the JSON response for parts from international Costco databases.
    
    Args:
        json_response (dict): The JSON response from the parts search.
        country (str): The country code to handle regional differences in data parsing.
    
    Returns:
        list: A list of dictionaries containing processed part details.
    """
    results = []
    if 'Results' in json_response and json_response['Results']:
        item_result = json_response['Results'][0]
        item_name = item_result.get("Name")
        image = item_result.get("ImageUrl")
        page_url = item_result.get("ProductPageUrl")
        if country in ["USA", "Canada"]:
            item_code = item_result.get("ModelNumbers", ["Error"])[0]
        else:
            item_code = item_result.get("Id", "Error")

        results.append({
            'item_name': item_name,
            'image': image,
            'page_url': page_url,
            'item_code': item_code
        })
    return results
