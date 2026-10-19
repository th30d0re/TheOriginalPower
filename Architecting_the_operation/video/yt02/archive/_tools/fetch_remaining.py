import json
import os
import ssl
import urllib.request

ctx = ssl._create_unverified_context()
BASE_DIR = "/Users/emmanuel/Documents/Theory/TheOriginalPower/Architecting_the_operation/video/yt02/archive"


def fetch_json(url):
  req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
  with urllib.request.urlopen(req, context=ctx, timeout=30) as r:
    return json.loads(r.read().decode("utf-8", errors="ignore"))


def fetch_text(url):
  req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
  with urllib.request.urlopen(req, context=ctx, timeout=30) as r:
    return r.read().decode("utf-8", errors="ignore")


# 1. Check federalistcollec00hami (1788 McLean edition Vol 1)
print("--- Checking federalistcollec00hami ---")
try:
  meta = fetch_json("https://archive.org/metadata/federalistcollec00hami")
  print("Title:", meta.get("metadata", {}).get("title"))
  print("Date:", meta.get("metadata", {}).get("date"))
  print(
      "Rights:",
      meta.get("metadata", {}).get(
          "rights", meta.get("metadata", {}).get("possible-copyright-status")
      ),
  )
  # Search inside IA fulltext for "Extend the sphere"
  q_url = "https://ia800200.us.archive.org/fulltext/inside.php?item_id=federalistcollec00hami&doc=federalistcollec00hami&path=/27/items/federalistcollec00hami&q=%22Extend%20the%20sphere%22"
  d1 = meta.get("d1")
  dir_path = meta.get("dir")
  if d1 and dir_path:
    inside_url = f"https://{d1}/fulltext/inside.php?item_id=federalistcollec00hami&doc=federalistcollec00hami&path={dir_path}&q=%22Extend%20the%20sphere%22"
    res = fetch_json(inside_url)
    print("Matches:", len(res.get("matches", [])))
    for m in res.get("matches", []):
      print(
          "Leaf:",
          m.get("par", [{}])[0].get("page"),
          "Text:",
          m.get("text", "")[:200],
      )
except Exception as e:
  print("Error federalist:", e)

# 2. Check chronicleofdisco01zura (1896 Hakluyt edition Vol 1)
print("\n--- Checking chronicleofdisco01zura ---")
try:
  meta = fetch_json("https://archive.org/metadata/chronicleofdisco01zura")
  print("Title:", meta.get("metadata", {}).get("title"))
  print("Date:", meta.get("metadata", {}).get("date"))
  print(
      "Rights:",
      meta.get("metadata", {}).get(
          "rights", meta.get("metadata", {}).get("possible-copyright-status")
      ),
  )
  d1 = meta.get("d1")
  dir_path = meta.get("dir")
  if d1 and dir_path:
    inside_url = f"https://{d1}/fulltext/inside.php?item_id=chronicleofdisco01zura&doc=chronicleofdisco01zura&path={dir_path}&q=%22white%20enough%22"
    res = fetch_json(inside_url)
    print("Matches:", len(res.get("matches", [])))
    for m in res.get("matches", []):
      print(
          "Leaf:",
          m.get("par", [{}])[0].get("page"),
          "Text:",
          m.get("text", "")[:200],
      )
except Exception as e:
  print("Error zurara:", e)

# 3. Check Dum Diversas in Davenport (eurotreatiesus00daverich) or Bullarium Patronatus
print("\n--- Checking Dum Diversas on IA ---")
try:
  search_url = "https://archive.org/advancedsearch.php?q=%28%22Bullarium+patronatus+Portugalliae%22+OR+%22Dum+diversas%22+OR+%22European+Treaties+bearing+on+the+History+of+the+United+States%22%29+AND+mediatype%3Atexts&fl[]=identifier,title,year,rights&output=json&rows=25"
  sres = fetch_json(search_url)
  for doc in sres.get("response", {}).get("docs", []):
    print(doc)
except Exception as e:
  print("Error dum diversas search:", e)
