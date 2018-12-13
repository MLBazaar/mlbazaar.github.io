import os
import sys
import glob
import errno
import operator
import json

from urllib.parse import urlparse

PATH_TO_DATA = "_data"
PATH_TO_LIBRARY = 'data-library/*.json'   
all_files = glob.glob(PATH_TO_LIBRARY)

def split_at(s, c, n):
    words = s.split(c)
    return c.join(words[:n])

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

    with open(file_path, "w+") as f:
        f.write("---\n")
        f.write("layout: '{0}'\n".format(layout))
        f.write("permalink: '{0}'\n".format(permalink))
        f.write("title: '{0}'\n".format(title))
        for keyField in options:
            f.write(str(keyField) + ": '" + options[keyField] + "'\n")
        f.write("---\n")

DATA_FILENAME = []
for name in all_files: # 'file' is a builtin type, 'name' is a less-ambiguous variable name.
    filename = os.path.basename(name)
    onlyname = os.path.splitext(filename)[0]
    
    datasetName = split_at(onlyname, '_', 2)
    if datasetName not in DATA_FILENAME:
        DATA_FILENAME.append(datasetName)

DATASET = {}
for name in DATA_FILENAME:
    try:
        item = {}
        file = 'data-library/' + name + '_datasetDoc.json'
        # datasetDoc
        if os.path.isfile(file):
            with open(file) as f: # No need to specify 'r': this is the default.
                item["datasetDoc"] = json.load(f)
        file = 'data-library/' + name + '_pipeline.json'
        # pipeline
        if os.path.isfile(file):
            with open(file) as f: # No need to specify 'r': this is the default.
                item["pipeline"] = json.load(f)
        file = 'data-library/' + name + '_problemDoc.json'
        # problemDoc
        if os.path.isfile(file):
            with open(file) as f: # No need to specify 'r': this is the default.
                item["problemDoc"] = json.load(f)
        file = 'data-library/' + name + '_template.json'
        # template
        if os.path.isfile(file):
            with open(file) as f: # No need to specify 'r': this is the default.
                item["template"] = json.load(f)
        # set path to detail page
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
    task_type = data["template"]["metadata"]["task_type"]
    if task_type:
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
    data_type = data["template"]["metadata"]["data_type"]
    if data_type:
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
    datasetName = data["datasetDoc"]["about"]["datasetName"]
    if dataset_path:
        detail_path = PATH_TO_DATASET + "/" + dataset_path + ".md"
        layout = "detail"
        permalink = PATH_TO_DATASET + "/" + dataset_path
        title = datasetName.capitalize()
        options = {"datasetID": datasetID}
        write_template_file(detail_path, layout, permalink, title, options)
