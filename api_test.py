import requests
import json
from typing import Dict, List, Any

class ProductValidator:
    def __init__(self):
        self.api_url = "http://localhost:3001/products"
        self.defects = []

    def validate_product(self, product: Dict[str, Any]) -> None:
        """Validate a single product object against all rules."""
        product_id = product.get('id', 'Unknown ID')

        # Validate title
        title = product.get('title', '')
        if not isinstance(title, str) or not title.strip():
            self.defects.append({
                'id': product_id,
                'type': 'Empty or invalid title',
                'details': f"Product title is empty or not a string: {title}"
            })

        # Validate price
        price = product.get('price', 0)
        if not isinstance(price, (int, float)) or price < 0:
            self.defects.append({
                'id': product_id,
                'type': 'Invalid price',
                'details': f"Product price is negative or not a number: {price}"
            })

        # Validate rating
        rating = product.get('rating', {})
        if isinstance(rating, dict):
            rate = rating.get('rate', 0)
            if not isinstance(rate, (int, float)) or rate > 5:
                self.defects.append({
                    'id': product_id,
                    'type': 'Invalid rating',
                    'details': f"Product rating exceeds 5 or is not a number: {rate}"
                })
        else:
            self.defects.append({
                'id': product_id,
                'type': 'Missing rating',
                'details': "Product rating object is missing or invalid"
            })

    def run_tests(self) -> None:
        """Execute all API tests and validations."""
        try:
            # Make API request
            response = requests.get(self.api_url)
            
            # Validate HTTP status code
            if response.status_code != 200:
                print(f"❌ API Request Failed: HTTP {response.status_code}")
                return

            print(f"✅ API Request Successful: HTTP {response.status_code}")

            # Parse JSON response
            products = response.json()
            
            if not isinstance(products, list):
                print("❌ API Response Error: Expected an array of products")
                return

            print(f"📦 Testing {len(products)} products...")

            # Validate each product
            for product in products:
                self.validate_product(product)

            # Print results
            self.print_results()

        except requests.RequestException as e:
            print(f"❌ API Request Error: {str(e)}")
        except json.JSONDecodeError as e:
            print(f"❌ JSON Parsing Error: {str(e)}")
        except Exception as e:
            print(f"❌ Unexpected Error: {str(e)}")

    def print_results(self) -> None:
        """Print the test results in a formatted way."""
        print("\n🔍 Test Results:")
        
        if not self.defects:
            print("✅ No defects found! All products passed validation.")
            return

        print(f"❌ Found {len(self.defects)} defects:")
        for defect in self.defects:
            print(f"\nProduct ID: {defect['id']}")
            print(f"Defect Type: {defect['type']}")
            print(f"Details: {defect['details']}")

if __name__ == "__main__":
    print("🚀 Starting API Tests...")
    validator = ProductValidator()
    validator.run_tests() 