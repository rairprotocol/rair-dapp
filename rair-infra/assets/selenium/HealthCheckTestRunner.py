#import constants
import pytest
import os
import urllib3
import json
from datetime import datetime
import subprocess
import argparse
import requests
import cgi
import zipfile
import xdist
import Automation.WebAutomation.utilities as ut
#import WebAutomation.utilities as ut
# construct the argument parser and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-p", "--MITM", required=True, help="Charles True or False")
ap.add_argument("-d", "--POST_DATA", required=True, help="Send Data to Server True or False")
ap.add_argument("-g", "--HEADLESS", required=True, help="Headless Option for Selenium Browsers - True or False")
args = vars(ap.parse_args())
import Automation.WebAutomation.webconfig as wc
#import WebAutomation.webconfig as wc
dashboardServerURL = 'http://' + wc.DASHBOARDHOST + ':' + wc.DASHBOARDPORT + '/save_web_test_json'
_data = {}

_data['MITM'] = args['MITM']
_data['POSTWEBDATA'] = args['POST_DATA']
_data['HEADLESS'] = args['HEADLESS']
print("........Entering data setup.....")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP_ROOT = os.path.join(BASE_DIR, 'AutomationResults/WebAutomation')
TEST_DATA_ROOT = os.path.join(APP_ROOT, 'test_resuts')
JSON_WIRE_ROOT = os.path.join(APP_ROOT, 'json_data_wire')
CSV_DATA_ROOT = os.path.join(APP_ROOT, 'csv_data')
EXCEL_REPORTS = os.path.join(APP_ROOT, 'excel_reports')
HTML_REPORTS = os.path.join(APP_ROOT, 'html_reports')
JSON_REPORTS = os.path.join(APP_ROOT, 'json_reports')

def createFolder(foldername):
    try:
        if not os.path.exists(foldername):
            os.makedirs(foldername)
            print('Created:', foldername)
    except OSError:
        print ("Creation of the directory %s failed" % foldername)
    else:
        print ("Successfully created the directory %s " % foldername)

if 'now' not in _data:
    now = datetime.now()
    _data['now'] = now

print("The Current Time in this file..... ", _data['now'])
#
if 'dt_string' not in _data:
    dt_string = None
    _data['dt_string'] = _data['now'].strftime("%d-%m-%Y-%H-%M-%S")
    print("Date and Time =", _data['dt_string'])

####################################################################
if 'test_results_dir_json_wire' not in _data:
    _data['test_results_dir_json_wire'] = os.path.join(JSON_WIRE_ROOT, str(_data['dt_string'] ))
if 'test_results_dir_csv' not in _data:
    _data['test_results_dir_csv'] = os.path.join(CSV_DATA_ROOT, str(_data['dt_string'] ))
if 'test_results_dir_excel' not in _data:
    _data['test_results_dir_excel'] = os.path.join(EXCEL_REPORTS, str(_data['dt_string'] ))
if 'test_results_dir_html' not in _data:
    _data['test_results_dir_html'] = os.path.join(HTML_REPORTS, str(_data['dt_string'] ))
if 'test_results_dir_json_reports' not in _data:
    _data['test_results_dir_json_reports'] = os.path.join(JSON_REPORTS, str(_data['dt_string'] ))
#########################################################################
print(".......Done Variable Setup.......")

def mainTest():
    testArgs_HTML = _data['test_results_dir_html'] + "/" + "report.html"
    testArgs_Excel = _data['test_results_dir_excel'] + "/" + "report.xls"
    testArgs_JSON = _data['test_results_dir_json_reports'] + "/" + "report.json"
    createFolder(_data['test_results_dir_json_wire'])
    createFolder(_data['test_results_dir_csv'])
    createFolder(_data['test_results_dir_excel'])
    createFolder(_data['test_results_dir_html'])
    createFolder(_data['test_results_dir_json_reports'])
    #pytest.main(["-vvv", "-s", os.path.join(BASE_DIR,'WebAutomation','HealthCheck.py'),os.path.join(BASE_DIR,'WebAutomation','RAIRHomePageTest_metamask.py'),os.path.join(BASE_DIR,'WebAutomation','RAIR_UseCases.py'), "--json=" + testArgs_JSON, "--html=" + testArgs_HTML,"--self-contained-html"])
    pytest.main(["-vvv", "-s", os.path.join(BASE_DIR,'WebAutomation','HealthCheck.py'), "--json=" + testArgs_JSON, "--html=" + testArgs_HTML,"--self-contained-html"])
    #pytest.main(["-vvv", "-s", os.path.join(BASE_DIR,'WebAutomation','HealthCheck_Resale.py'), "--json=" + testArgs_JSON, "--html=" + testArgs_HTML,"--self-contained-html"])
    print("Web Test Done")

    # JSON Data #
    json_data = open(testArgs_JSON).read()
    testArgs_JSON

    # HTML Data #
    html_data = open(testArgs_HTML).read()
    testArgs_HTML

    # Zip file from JSON WIRE DATA
    print("Creating Archive")
    zipName = ut.createZIP(_data['test_results_dir_json_wire'],_data['dt_string'])
    print(zipName)
    # 'metrics': zipName+'.zip'
    params = {
        "FILENAME": json_data,
        "FILENAME_HTML": html_data,
        'testtype': 'web',
        'datetestrun': _data['dt_string'],
        'metrics': zipName + '.zip'

    }

    # Send Data to server only if True
    if _data['POSTWEBDATA'] == 'True':
        print("Sending the data to the server....... ")
        http = urllib3.PoolManager()
       #resp = http.request('POST', dashboardServerURL,params )
        #print(resp.status)
        print("Done")

if __name__ == "__main__":
    mainTest()
