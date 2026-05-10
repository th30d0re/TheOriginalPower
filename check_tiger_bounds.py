import requests
import geopandas as gpd
import io

city = {"id": "baltimore_md", "label": "Baltimore MD", "fips_county": "24510"}
county_fips = city["fips_county"]
state_fips  = county_fips[:2]
county_code = county_fips[2:]
url = (
    "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/"
    "tigerWMS_Census2020/MapServer/8/query"
)
params = {
    "where": f"STATE='{state_fips}' AND COUNTY='{county_code}'",
    "outFields": "GEOID",
    "returnGeometry": "true",
    "f": "geojson",
}
r = requests.get(url, params=params, timeout=60)
gdf = gpd.read_file(io.BytesIO(r.content))
print(f"Bounds: {gdf.total_bounds}")
