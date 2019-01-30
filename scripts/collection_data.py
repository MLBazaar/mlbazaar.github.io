import os
import sys
import glob
import errno
import operator
import json
import codecs

from urllib.parse import urlparse

PATH_TO_DATA = "_data"
PATH_TO_LIBRARY = 'data-library/'

def split_last(s, c):
    words = s.split(c)
    return words[len(words) - 1]

def extract_domain_from_url(url):
    parsed_uri = urlparse(url)
    domain = '{uri.netloc}'.format(uri=parsed_uri)
    domain = domain.replace("www.", "")
    #result = '{uri.scheme}://{uri.netloc}/'.format(uri=parsed_uri)
    
    return domain

# GENERATE TEMPLATE FILE
PATH_TO_DATASET = "dataset"
URL_DATASET = "/dataset"

def write_template_file(file_path, layout, permalink, title, options={}):
    if not os.path.exists(os.path.dirname(file_path)):
        os.makedirs(os.path.dirname(file_path))

    f = codecs.open(file_path, "w+", "utf-8")
    f.write("---\n")
    f.write("layout: '{0}'\n".format(layout))
    f.write("permalink: '{0}'\n".format(permalink))
    f.write("title: '{0}'\n".format(title))
    for keyField in options:
        f.write(str(keyField) + ": '" + options[keyField] + "'\n")
    f.write("---\n")
    f.close()

DATASET = {}
for subdir, dirs, files in os.walk(PATH_TO_LIBRARY):
  try:
    item = {}
    for filename in files:
      file = subdir + '/' + filename
      if os.path.isfile(file):
        with open(file) as f: # No need to specify 'r': this is the default.
          # datasetDoc
          if filename == 'datasetDoc.json':
            item["datasetDoc"] = json.load(f)
          # pipeline
          if filename == 'best_pipeline.json':
            item["pipeline"] = json.load(f)
          # problemDoc
          if filename == 'problemDoc.json':
            item["problemDoc"] = json.load(f)

    if bool(item):
      # set path to detail page
      name = split_last(subdir, '/')
      item["dataset_path"] = name.replace("_", "-")

      DATASET[name] = item
  except IOError as exc:
    if exc.errno != errno.EISDIR:
        raise "Error when load data"


# Save to _data directory
file_path = PATH_TO_DATA + "/" + "datasets.json"
with open(file_path, "w+") as f:
    json.dump(DATASET, f)
print("LOG: Saved datasets to", file_path)

# Extract Domain from URL
LIST_DOMAIN = []
for dataset_name in DATASET:
    data = DATASET[dataset_name]
    sourceURI = data["datasetDoc"]["about"]["sourceURI"]
    if sourceURI:
        domain = extract_domain_from_url(sourceURI)
        if domain not in LIST_DOMAIN:
          LIST_DOMAIN.append(domain)
# Save to _data directory
file_path = PATH_TO_DATA + "/" + "domains.json"
with open(file_path, "w+") as f:
    json.dump(LIST_DOMAIN, f)
print("LOG: Saved domains to", file_path)

# Task Type
LIST_TASKTYPE = []
for dataset_name in DATASET:
    data = DATASET[dataset_name]
    task_type = data["pipeline"]["loader"]["task_type"]
    if task_type and task_type not in LIST_TASKTYPE:
        LIST_TASKTYPE.append(task_type)
# Save to _data directory
file_path = PATH_TO_DATA + "/" + "tasktype.json"
with open(file_path, "w+") as f:
    json.dump(LIST_TASKTYPE, f)
print("LOG: Saved task_type to", file_path)

# Data Type
LIST_DATATYPE = []
for dataset_name in DATASET:
    data = DATASET[dataset_name]
    data_type = data["pipeline"]["loader"]["data_modality"]
    if data_type and data_type not in LIST_DATATYPE:
        LIST_DATATYPE.append(data_type)
# Save to _data directory
file_path = PATH_TO_DATA + "/" + "datatype.json"
with open(file_path, "w+") as f:
    json.dump(LIST_DATATYPE, f)
print("LOG: Saved data_type to", file_path)

# Generate template for detail dataset
for datasetID in DATASET:
    data = DATASET[datasetID]
    dataset_path = data["dataset_path"]
    datasetName = data['problemDoc']['_id']
    if dataset_path:
        detail_path = PATH_TO_DATASET + "/" + dataset_path + ".md"
        layout = "detail"
        permalink = PATH_TO_DATASET + "/" + dataset_path
        title = datasetName.capitalize()
        options = {"datasetID": datasetID}
        write_template_file(detail_path, layout, permalink, title, options)
