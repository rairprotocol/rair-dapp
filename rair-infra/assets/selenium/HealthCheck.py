import unittest
from selenium import webdriver

# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException, ElementClickInterceptedException, NoSuchWindowException, \
    ElementNotInteractableException, WebDriverException
from selenium.common.exceptions import NoAlertPresentException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.proxy import Proxy, ProxyType
import unittest, time, re
from bs4 import BeautifulSoup
import pickle
import random
import csv
import traceback
import Automation.WebAutomation.alog
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
#import WebAutomation.alog
import xml.parsers.expat as xmlerr
import shutil,os,zipfile,socket,time
import json
import sys
import csv
import xml.etree.cElementTree as ET
import pprint
import requests
from collections import defaultdict
from datetime import datetime
import math
from decimal import Decimal
import os
import platform
import zipfile
import mmap
import uuid
import os
import traceback
from threading import Thread
from time import sleep
import subprocess
from subprocess import call
from subprocess import Popen, PIPE
import threading
import glob
from threading import Lock
lock = Lock()
import multiprocessing
import time
import mmap
import pprint
import pytest
from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.firefox.options import Options as options
from selenium.webdriver.firefox.service import Service
#from selenium.webdriver.opera.options import Options
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.support.ui import Select
from time import sleep
import Automation.WebAutomation.charlesProxyService as c
#import WebAutomation.charlesProxyService as c
from Automation.WebAutomation.utilities import createFolder
#from WebAutomation.utilities import createFolder
import Automation.WebAutomation.webconfig as wc
#import WebAutomation.webconfig as wc
from Automation.WebAutomation.HealthCheckTestRunner import _data
#from WebAutomation.RAIRHomePageTestRunner import _data
from sys import platform
from Locators import Locator
from PIL import Image
from pytesseract import pytesseract
import re

pp = pprint.PrettyPrinter(indent=4)

BASE_DIR = os.getcwd()
print("The current directory is")
print(BASE_DIR)

#os.path.join(BASE_DIR,
base_path = BASE_DIR

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
print("The current directory is")
print(BASE_DIR)

ABOUT_PAGE_URL = wc.ABOUT_PAGE_URL
BETA_URL = wc.BETA_URL
RAIRLICENSE = wc.RAIRLICENSE
GREYMAN_URL = wc.GREYMAN_URL
QA1_URL = wc.QA1_URL
QA2_URL = wc.QA2_URL
QA3_URL = wc.QA3_URL
RAIRPROTOCOL = wc.RAIRPROTOCOL
RAIR_MARKET = wc.RAIR_MARKET
OPENCARBON_MARKET = wc.OPENCARBON_MARKET
HOTDROPS_URL = wc.HOTDROPS_URL
HOTDROPS_PROD_URL = wc.HOTDROPS_PROD_URL
PROD_URL = wc.PROD_URL
SECRET_RECOVERY_PHRASE = wc.SECRET_RECOVERY_PHRASE
SECRET_RECOVERY_PHRASE_QA = wc.SECRET_RECOVERY_PHRASE_QA
NEW_PASSWORD = wc.NEW_PASSWORD
NEW_PASSWORD_QA = wc.NEW_PASSWORD_QA
ChromeExtension_Url = wc.ChromeExtension_Url
Expected_Filter_Labels = wc.Expected_Filter_Labels

WEBDRIVERDIRECTORY = os.path.join(BASE_DIR, 'WebAutomation/Drivers', 'webdrivers')
SCREENSHOT_DIRECTORY = os.path.join(BASE_DIR, 'WebAutomation/screenshots', '')
VIDEO_UPLOAD_FILE = os.path.join(BASE_DIR, 'WebAutomation', '202307_video.mp4')
#VIDEO_UPLOAD_FILE = os.path.join(BASE_DIR, 'WebAutomation', '500MB.mp4')
METADATA_CSV_FILE = os.path.join(BASE_DIR, 'WebAutomation', 'Metadata_5k.csv')

conversationBuilderBot = {}
conversationBuilderBot = {}

############################################################
global test_results_dir_json_wire
global test_results_dir_csv
global test_results_dir_excel
global test_results_dir_html
global test_results_dir_json_reports

#############################  #############################
print("Getting the values for the Directories")
test_results_dir_json_wire = _data['test_results_dir_json_wire']
print(test_results_dir_json_wire)
test_results_dir_csv = _data['test_results_dir_csv']
print(test_results_dir_csv)
test_results_dir_excel = _data['test_results_dir_excel']
print(test_results_dir_excel)
test_results_dir_html = _data['test_results_dir_html']
print(test_results_dir_html)
test_results_dir_json_reports = _data['test_results_dir_json_reports']
print(test_results_dir_json_reports)

###########################################################

if platform == "linux" or platform == "linux2":
    print("Linux")
    platform = 'Linux'
    WEBDRIVERDIRECTORY_CHROMEDRIVER = os.path.join(WEBDRIVERDIRECTORY,'chromedriver','chromedriver_linux64')
    WEBDRIVERDIRECTORY_FIREFOXDRIVER = os.path.join(WEBDRIVERDIRECTORY, 'firefoxdriver','geckodriver-linux64')
    #EXTENSION_PATH_FIREFOX = '/home/xxxxxx/snap/firefox/common/.mozilla/firefox/3ct2n3rf.default/extensions/webextension@metamask.io.xpi'
    EXTENSION_PATH_FIREFOX = '/home/xxxx/.mozilla/firefox/extensions/webextension@metamask.io.xpi'
    EXTENSION_PATH_CHROME = '/home/xxxxxx/.config/google-chrome/Default/Extensions/nkbihfbeogaeaoehlefnkodbefgpgknn/10.3.0_0.crx'

if platform == "darwin":
    print("Darwin")
    platform = 'Darwin'
    WEBDRIVERDIRECTORY_CHROMEDRIVER = os.path.join(WEBDRIVERDIRECTORY, 'chromedriver', 'chromedriver_mac64')
    WEBDRIVERDIRECTORY_FIREFOXDRIVER = os.path.join(WEBDRIVERDIRECTORY, 'firefoxdriver', 'geckodriver-macos')
    WEBDRIVERDIRECTORY_SAFARIDRIVER = os.path.join(WEBDRIVERDIRECTORY, '', '')


if platform == "win32":
    print("Win32")
    platform = 'Win32'
    WEBDRIVERDIRECTORY_CHROMEDRIVER = os.path.join(WEBDRIVERDIRECTORY, 'chromedriver', 'chromedriver_win32')
    WEBDRIVERDIRECTORY_FIREFOXDRIVER = os.path.join(WEBDRIVERDIRECTORY, 'firefoxdriver', 'geckodriver-win64')

if platform == "win64":
    print("Win64")
    platform = 'Win64'
    WEBDRIVERDIRECTORY_CHROMEDRIVER = os.path.join(WEBDRIVERDIRECTORY, 'chromedriver', 'chromedriver_win32')
    WEBDRIVERDIRECTORY_FIREFOXDRIVER = os.path.join(WEBDRIVERDIRECTORY, 'firefoxdriver', 'geckodriver-win64')

#@pytest.fixture(params=["chrome"],scope="class")
@pytest.fixture(params=["firefox"],scope="class")

def driver_init(request):
    if request.param == "chrome":
        # Local webdriver implementation
        print("Starting Chrome test")
        if _data['MITM'] == 'True':
            print("Since the MITM Proxy is TRUE we will Set the Proxy option")
            myProxy = wc.MITMHOST + ':' + wc.MITMPORT
            chrome_options = webdriver.ChromeOptions()
            chrome_options.add_argument('--proxy-server=%s' % myProxy)
            chrome_options.add_argument('ignore-certificate-errors')
            if _data['HEADLESS'] == 'True':
                print("Setting the Headless option for Chrome")
                chrome_options.add_argument("--headless")
                chrome_options.add_argument('--no-sandbox')
                chrome_options.add_argument('--disable-dev-shm-usage')
            print("Chromedriver Location")
            print(WEBDRIVERDIRECTORY_CHROMEDRIVER + '/chromedriver')
            web_driver = webdriver.Chrome(executable_path=WEBDRIVERDIRECTORY_CHROMEDRIVER + '/chromedriver',options=chrome_options)
        else:
            print("Since the MITM Proxy is FALSE we will NOT Set the Proxy option")
            print("Chromedriver Location")
            print(WEBDRIVERDIRECTORY_CHROMEDRIVER + '/chromedriver')
            chrome_options = webdriver.ChromeOptions()
            chrome_options.add_extension(EXTENSION_PATH_CHROME)
            if _data['HEADLESS'] == 'True':
                print("Setting the Headless option for Chrome")
                chrome_options.add_argument("--headless")
                chrome_options.add_argument('--no-sandbox')
                chrome_options.add_argument('--disable-dev-shm-usage')
            web_driver = webdriver.Chrome(executable_path=WEBDRIVERDIRECTORY_CHROMEDRIVER + '/chromedriver',options=chrome_options)

    if request.param == "firefox":
        print("Starting Firefox test")
        if _data['MITM'] == 'True':
            print("Since the MITM Proxy is TRUE we will Set the Proxy option")
            # Local webdriver implementation
            myProxy = wc.MITMHOST + ':' + wc.MITMPORT
            proxy = Proxy({
                'proxyType': ProxyType.MANUAL,
                'httpProxy': myProxy,
                'ftpProxy': myProxy,
                'sslProxy': myProxy,
                'noProxy': ''  # set this value as desired
            })

            fireFoxOptions = webdriver.FirefoxOptions()
            if _data['HEADLESS'] == 'True':
                print("Setting the Headless option for Firefox")
                fireFoxOptions.set_headless()
            fireFoxOptions.set_preference('network.http.phishy-userpass-length', 255)
            fireFoxOptions.set_preference("network.automatic-ntlm-auth.trusted-uris", BETA_URL)
            fireFoxOptions.set_preference("network.proxy.type", 1)
            fireFoxOptions.set_preference("network.proxy.http", wc.MITMHOST)
            fireFoxOptions.set_preference("network.proxy.http_port", wc.MITMPORT)
            ###############################
            # fireFoxOptions.set_preference('network.proxy.type', 1)
            # # Set the host/port.
            # fireFoxOptions.set_preference('network.proxy.http', proxy_host)
            fireFoxOptions.set_preference('network.proxy.https_port', wc.MITMPORT)
            fireFoxOptions.set_preference("network.proxy.ssl", wc.MITMHOST)
            fireFoxOptions.set_preference("network.proxy.ssl_port", int(wc.MITMPORT))
            print("Gecko Location")
            print(WEBDRIVERDIRECTORY_FIREFOXDRIVER + '/geckodriver')
            web_driver = webdriver.Firefox(executable_path=WEBDRIVERDIRECTORY_FIREFOXDRIVER + '/geckodriver', firefox_options=fireFoxOptions)
            web_driver.implicitly_wait(1)
        else:
            print("Since the MITM Proxy is FALSE we will NOT Set the Proxy option")
            print("Gecko Location")
            print(WEBDRIVERDIRECTORY_FIREFOXDRIVER + '/geckodriver')
            fireFoxOptions = webdriver.FirefoxOptions()
            if _data['HEADLESS'] == 'True':
                print("Setting the Headless option for Firefox")
                fireFoxOptions.add_argument("--headless")
                #fireFoxOptions.set_headless()
            
            #Do not wait for page to download completely
            options = Options()
            options.add_argument("-profile")
            options.add_argument("/home/xxxxxx/.mozilla/firefox")
            #options.add_argument("/home/opendatalabs/snap/firefox/common/.mozilla/firefox/3ct2n3rf.default")
            caps = DesiredCapabilities().FIREFOX
            caps["pageLoadStrategy"] = "eager"
            new_driver_path = WEBDRIVERDIRECTORY_FIREFOXDRIVER + '/geckodriver'
            serv = Service(new_driver_path)
            web_driver = webdriver.Firefox(service=serv, options=fireFoxOptions)
            web_driver.implicitly_wait(1)

    # if request.param == "safari":
    #     # Local webdriver implementation
    #     options = Options()

    request.cls.driver = web_driver
    yield
    #web_driver.close()

    web_driver.quit()

def metamask_user_login(self, xxxx, pwd):
    driver = self.driver
    sleep(5)
    driver.find_element("xpath", '//*[@id="onboarding__terms-checkbox"]').click()
    #driver.find_element("xpath", '//button[text()="Get started"]').click()
    #sleep(5)
    #driver.find_element("xpath",'//button[text()="No thanks"]').click()
    sleep(2)
    driver.find_element("xpath",'//button[text()="Import an existing wallet"]').click()
    sleep(5)
    driver.find_element("xpath", '//button[text()="I agree"]').click()
    sleep(5)
    #driver.find_element("xpath",'//button[text()="No Thanks"]').click()
    #sleep(5)
    # After this you will need to enter you wallet details
    inputs = driver.find_elements("xpath",'//input')

    SECRET_RECOVERY_PHRASE = xxxx
    NEW_PASSWORD = pwd

    SEED_PHRASE = list(SECRET_RECOVERY_PHRASE.split(" "))
    print(SEED_PHRASE)
    i = 0
    j = 0
    while j <= 11:
        print(SEED_PHRASE[j])
        inputs[i].send_keys(SEED_PHRASE[j])
        i = i + 2
        j = j + 1

    sleep(5)
    driver.find_element("xpath",'//button[text()="Confirm Secret Recovery Phrase"]').click()
    sleep(10)
    inputs2 = driver.find_elements("xpath", '//input')
    inputs2[0].send_keys(NEW_PASSWORD)
    sleep(5)
    # driver.find_element('//*[@id="confirm-password"]').send_keys(NEW_PASSWORD)
    inputs2[1].send_keys(NEW_PASSWORD)
    sleep(5)
    driver.find_element("xpath", '//*[@class="create-password__form__terms-label"]').click()
    #driver.find_element("xpath",'//*[@id="create-new-vault__terms-checkbox"]').click()
    # driver.find_element_by_css_selector('.first-time-flow__terms').click()
    sleep(5)
    driver.find_element("xpath",'//button[text()="Import my wallet"]').click()
    sleep(20)
    driver.find_element("xpath", '//button[text()="Got it"]').click()
    sleep(5)
    driver.find_element("xpath", '//button[text()="Next"]').click()
    sleep(5)
    driver.find_element("xpath",'//button[text()="Done"]').click()
    sleep(10)

def Switch_Blockchain(self):
    driver = self.driver
    print("driver.window_handles : " + str(self.driver.window_handles))
    driver.switch_to.window(driver.window_handles[-1])
    time.sleep(10)
    driver.find_element("xpath","//button[contains(.,'Approve')]").click()
    time.sleep(10)
    print("driver.window_handles_network : " + str(self.driver.window_handles))
    driver.switch_to.window(driver.window_handles[-1])
    time.sleep(5)
    driver.find_element("xpath","//button[contains(.,'Switch network')]").click()
    time.sleep(5)
    driver.switch_to.window(driver.window_handles[-1])
    time.sleep(5)

def ConnectWallet_metamask(self,server):

    self.driver.get(server)
    self.driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.CONTROL + "R")
    print(self.driver.title)
    driver = self.driver
    ###########Added because of Bug#########
    try:
        time.sleep(5)
        driver.switch_to.window(driver.window_handles[-1])
        time.sleep(10)
        driver.find_element("xpath", Locator.connect_wallet).click()
        time.sleep(2)
        print("No errors")
    except:

        print("An exception occurred")
        driver.switch_to.window(driver.window_handles[-1])
        time.sleep(5)
        driver.find_element("xpath","//button[contains(.,'Cancel')]").click()
        #webdriver.ActionChains(driver).send_keys(Keys.TAB,Keys.TAB,Keys.ENTER).perform()
        time.sleep(5)
        driver.switch_to.window(driver.window_handles[-1])
        time.sleep(5)
        webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()
        driver.switch_to.window(driver.window_handles[-1])
        driver.implicitly_wait(10)
        driver.find_element("xpath", Locator.connect_wallet).click()
        #####################

    finally:

        time.sleep(10)
        driver.switch_to.window(driver.window_handles[-1])
        driver.find_element("xpath", "//button[contains(.,'Web3')]").click()
        time.sleep(5)
        driver.switch_to.window(driver.window_handles[-1])
        print("driver.window_handles : " + str(self.driver.window_handles))
        driver.find_element("xpath", "//button[contains(.,'Next')]").click()
        time.sleep(10)
        driver.find_element("xpath", "//button[contains(.,'Confirm')]").click()
        time.sleep(20)
        print("driver.window_handles_updated : " + str(self.driver.window_handles))
        print("Metamask_window_handle : " + str(self.driver.window_handles[2]))
        time.sleep(5)
        driver.switch_to.window(driver.window_handles[-1])
        time.sleep(5)

        # Challenge Block
        # driver.find_element("xpath","//div[1]/div/div[2]/div/div[3]/div[1]/i").click()
        try:
            driver.find_element("xpath", '//*[@class="fa fa-arrow-down"]').click()
        except:
            print("An exception occurred")
        finally:
            time.sleep(5)
            driver.find_element("xpath", "//button[contains(.,'Sign')]").click()
            time.sleep(15)
            print("driver.window_handles_updated : " + str(self.driver.window_handles))
            # driver.switch_to.window(driver.window_handles[2])
            time.sleep(5)
            driver.switch_to.window(driver.window_handles[-1])
            print("Sign-in completed")
            #Saving the Screenshot
            driver.save_screenshot(SCREENSHOT_DIRECTORY + "ConnectWallet.png")

            # Nonce Block
            # driver.find_element_by_xpath("//button[contains(.,'Sign')]").click()
            # time.sleep(5)
            # driver.switch_to.window(driver.window_handles[-1])
            # time.sleep(5)
            # driver.find_element_by_class_name(Locator.menu_admin).click()
            # time.sleep(5)
            #########################################################

def Logout(self):
    driver = self.driver
    time.sleep(10)

    # driver.find_element_by_xpath("//a[contains(@href, '/all')]").click()
    try:
        driver.find_element(By.XPATH, Locator.profile_dropdown).click()
    except:
        print("### Exception ###")
        driver.find_element(By.XPATH, Locator.profile_dropdown_beta).click()
    else:
        print("Nothing went wrong")

    sleep(5)
    driver.find_element(By.XPATH, "//li[contains(.,'Logout')]").click()
    time.sleep(5)
    webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()

    driver.delete_all_cookies()

    # Saving the Screenshot
    driver.save_screenshot(SCREENSHOT_DIRECTORY + "Contract_ConfirmReject.png")
    time.sleep(10)

    # Opening the image & storing it in an image object
    img = Image.open(SCREENSHOT_DIRECTORY + "Contract_ConfirmReject.png")
    time.sleep(5)

    # Size of the image in pixels (size of original image)
    # (This is not mandatory)
    width, height = img.size

    # Setting the points for cropped image
    left = 400
    top = height / 8
    right = 1200
    bottom = 7 * height / 8

    # Cropped image of above dimension
    # (It will not change original image)
    im1 = img.crop((left, top, right, bottom))
    # Shows the image in image viewer
    # im1.show()

    # Passing the image object to image_to_string() function
    # This function will extract the text from the image
    text = pytesseract.image_to_string(im1)

    # Modifying text
    mod_text = text.rstrip()
    without_line_breaks = mod_text.replace("\n", " ")

    # Appending text to log file
    test_logs = open(SCREENSHOT_DIRECTORY + "TestExecutionLogs.txt", "a")
    test_case_name = os.environ.get('PYTEST_CURRENT_TEST').split(':')[-1].split(' ')[0]
    test_logs.write(
        Test_HealthCheck.dt_string + "," + test_case_name + "," + without_line_breaks + "\n")
    test_logs.close()
    # print(text[:-1])
    time.sleep(5)

def Logout_hotdrops(self):
    driver = self.driver
    time.sleep(10)

    webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()
    # driver.find_element_by_xpath("//a[contains(@href, '/all')]").click()
    try:
        driver.find_element(By.XPATH, Locator.profile_dropdown_hotdrops).click()
    except:
        print("### Exception ###")
        driver.find_element(By.XPATH, Locator.profile_dropdown).click()
    else:
        print("Nothing went wrong")

    sleep(5)
    driver.find_element(By.XPATH, "//li[contains(.,'Logout')]").click()
    time.sleep(5)
    webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()

    driver.delete_all_cookies()

def delete_cookies(self):
    driver = self.driver
    driver.get('about:preferences#privacy')
    clear_button = driver.find_element(By.XPATH, '//*[@id="clearSiteDataButton"]')
    time.sleep(2)
    driver.execute_script("arguments[0].scrollIntoView();", clear_button)
    time.sleep(5)
    ActionChains(driver).move_to_element(clear_button).click().perform()
    time.sleep(5)
    driver.switch_to.window(driver.window_handles[-1])
    time.sleep(2)
    webdriver.ActionChains(driver).send_keys(Keys.TAB).perform()
    time.sleep(2)
    webdriver.ActionChains(driver).send_keys(Keys.TAB).perform()
    time.sleep(2)
    webdriver.ActionChains(driver).send_keys(Keys.TAB).perform()
    time.sleep(2)
    webdriver.ActionChains(driver).send_keys(Keys.ENTER).perform()
    time.sleep(5)
    cookie_alert = driver.switch_to.alert
    cookie_alert.accept()
    time.sleep(2)
    #driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.CONTROL + "w")
    # driver.execute_script("arguments[0].click();", clear_button)
    #checkboxes = driver.find_elements(By.XPATH, "//input[@type='checkbox']")
    #for checkbox in checkboxes:
    #    if not checkbox.is_selected():
    #        checkbox.click()
    #clear_button = driver.find_element(By.XPATH, "//button[@data-testid='clear-private-data-button']")
    #ActionChains(driver).move_to_element(clear_button).click().perform()


@pytest.mark.usefixtures("driver_init")
class BasicTest:
    print("Initializing Basic Test")
    pass
class Test_HealthCheck(BasicTest):
        print("Initializing URL Open Test")

        now = datetime.now()
        dt_string = now.strftime("%d%m%Y_%H%M%S")
        addon_id = "null"
        SUT = OPENCARBON_MARKET
        SEARCH_CONTRACT = "2106"

        @pytest.mark.run(order=1)
        #@pytest.mark.skip
        def test_metamask_login_publicKey(self):
            try:

                _t = None
                print("Running the Test Open Url")
                if _data['MITM'] == 'True':
                    print("Clearing Cache as flag is True")
                    c.clearCache()
                time.sleep(2)
                ######################### Using Proxy Service ##########################################

                Test_HealthCheck.addon_id = self.driver.install_addon(EXTENSION_PATH_FIREFOX, temporary=True)
                print(Test_HealthCheck.addon_id)
                time.sleep(10)
                #self.driver.get(ChromeExtension_Url)
                #self.driver.get("about:support")
                sleep(10)
                print("driver.window_handles : " + str(self.driver.window_handles))
                print("current window handle : " + str(self.driver.current_window_handle))
                self.driver.switch_to.window(window_name=self.driver.window_handles[-1])
                metamask_user_login(self, SECRET_RECOVERY_PHRASE_QA,NEW_PASSWORD_QA)
                sleep(10)


            except AssertionError:
                pytest.fail("Test case failed")
            except NoSuchElementException:
                pytest.fail("Test case failed")
            except ElementClickInterceptedException:
                pytest.fail("Test case failed")
            except IndexError:
                pytest.fail("Test case failed")
            except NoSuchWindowException:
                pytest.fail("Test case failed")
            except:
                print(traceback.format_exc())

        @pytest.mark.run(order=2)
        #@pytest.mark.skip
        def test_connectWallet_metamask_OpenCarbon(self):
            try:

                _t = None
                print("Running the Test Open Url")
                if _data['MITM'] == 'True':
                    print("Clearing Cache as flag is True")
                    c.clearCache()
                time.sleep(2)
                ###

                driver = self.driver

                #####################
                ConnectWallet_metamask(self,Test_HealthCheck.SUT)
                # refresh page
                driver.refresh()
                time.sleep(25)

            except AssertionError:
                pytest.fail("Test case failed")
            except NoSuchElementException:
                pytest.fail("Test case failed")
            except IndexError:
                pytest.fail("Test case failed")
            except NoSuchWindowException:
                pytest.fail("Test case failed")
            except:
                print(traceback.format_exc())


        @pytest.mark.skip
        def test_Upload_DemoVideo_MVP(self):
            try:

                        _t = None
                        print("Running the Test Open Url")
                        if _data['MITM'] == 'True':
                            print("Clearing Cache as flag is True")
                            c.clearCache()
                        time.sleep(2)
                        ######################### Using Proxy Service ##########################################

                        driver = self.driver
                        time.sleep(10)

                        # driver.find_element_by_xpath("//a[contains(@href, '/all')]").click()
                        driver.find_element(By.XPATH, '//body').send_keys(Keys.CONTROL + Keys.HOME)
                        time.sleep(10)
                        # Saving the Screenshot
                        driver.save_screenshot(SCREENSHOT_DIRECTORY + "DemoVideoUpload.png")
                        #driver.find_element_by_xpath("//div[@id='root']/div/div/div/div[3]/div/div[2]/div/div/button[2]").click()
                        #driver.find_element(By.XPATH,Locator.profile_dropdown_hotdrops).click()
                        try:
                            driver.find_element(By.XPATH, Locator.profile_dropdown).click()
                        except:
                            print("### Exception ###")
                            driver.find_element(By.XPATH, Locator.profile_dropdown_hotdrops).click()
                        else:
                            print("Nothing went wrong")
                        #driver.find_element_by_xpath("//span[contains(.,'@suresh111')]").click()
                        sleep(5)
                        driver.find_element(By.XPATH,"//li[contains(.,'Upload')]").click()
                        time.sleep(5)
                        webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()
                        #Upload video
                        time.sleep(5)
                        driver.find_element("xpath", "//input[@type='file']").send_keys(VIDEO_UPLOAD_FILE)
                        time.sleep(10)
                        print("driver.window_handles : " + str(self.driver.window_handles))
                        #driver.find_element("xpath", "//button[contains(.,'Select offer')]").click()
                        offer = driver.find_element("xpath", "//button[contains(.,'Select offer')]")
                        time.sleep(5)
                        driver.execute_script("arguments[0].scrollIntoView();", offer)
                        driver.execute_script("arguments[0].click();", offer)
                        #driver.find_element("xpath", "//div[1]/div/div/div[3]/div[2]/div/div/div[2]/div/div[2]/div/div").click()
                        time.sleep(10)
                        webdriver.ActionChains(driver).send_keys(Keys.TAB).perform()
                        time.sleep(5)
                        webdriver.ActionChains(driver).send_keys(Keys.ARROW_DOWN).perform()
                        time.sleep(5)
                        #webdriver.ActionChains(driver).send_keys(Keys.ARROW_RIGHT).perform()
                        #time.sleep(5)
                        #webdriver.ActionChains(driver).send_keys(Keys.ARROW_RIGHT).perform()
                        #time.sleep(5)
                        #webdriver.ActionChains(driver).send_keys(Keys.ARROW_RIGHT).perform()
                        #time.sleep(5)
                        webdriver.ActionChains(driver).send_keys(Keys.TAB).perform()
                        time.sleep(5)
                        webdriver.ActionChains(driver).send_keys(Keys.ARROW_DOWN).perform()
                        time.sleep(5)
                        webdriver.ActionChains(driver).send_keys(Keys.ARROW_DOWN).perform()
                        time.sleep(5)
                        webdriver.ActionChains(driver).send_keys(Keys.TAB).perform()
                        time.sleep(5)
                        webdriver.ActionChains(driver).send_keys(Keys.ARROW_DOWN).perform()
                        time.sleep(5)
                        driver.find_element("xpath", "//button[contains(.,'Unlockable')]").click()
                        time.sleep(5)
                        driver.find_element("xpath", "//button[contains(.,'Save')]").click()
                        time.sleep(5)
                        driver.switch_to.window(driver.window_handles[-1])
                        time.sleep(5)
                        driver.find_element(By.XPATH, '//body').send_keys(Keys.CONTROL + Keys.HOME)
                        time.sleep(5)
                        driver.find_element("xpath", "//button[contains(.,'Upload')]").click()
                        time.sleep(5)
                        driver.switch_to.window(driver.window_handles[-1])
                        time.sleep(5)
                        driver.find_element("xpath", "//button[contains(.,'Cloud')]").click()
                        time.sleep(120)
                        # refresh page
                        driver.refresh()
                        # Saving the Screenshot
                        driver.save_screenshot(SCREENSHOT_DIRECTORY + "Contract_ConfirmReject.png")
                        time.sleep(10)

                        # Opening the image & storing it in an image object
                        img = Image.open(SCREENSHOT_DIRECTORY + "Contract_ConfirmReject.png")
                        time.sleep(5)

                        # Size of the image in pixels (size of original image)
                        # (This is not mandatory)
                        width, height = img.size

                        # Setting the points for cropped image
                        left = 400
                        top = height / 8
                        right = 1200
                        bottom = 7 * height / 8

                        # Cropped image of above dimension
                        # (It will not change original image)
                        im1 = img.crop((left, top, right, bottom))
                        # Shows the image in image viewer
                        # im1.show()

                        # Passing the image object to image_to_string() function
                        # This function will extract the text from the image
                        text = pytesseract.image_to_string(im1)

                        # Modifying text
                        mod_text = text.rstrip()
                        without_line_breaks = mod_text.replace("\n", " ")

                        # Appending text to log file
                        test_logs = open(SCREENSHOT_DIRECTORY + "TestExecutionLogs.txt", "a")
                        test_case_name = os.environ.get('PYTEST_CURRENT_TEST').split(':')[-1].split(' ')[0]
                        test_logs.write(
                            Test_HealthCheck.dt_string + "," + test_case_name + "," + without_line_breaks + "\n")
                        test_logs.close()
                        # print(text[:-1])
                        time.sleep(5)

                        # driver.find_element_by_xpath('//button[text()="OK"]').click()
                        # print("driver.window_handles_final : " + str(self.driver.window_handles))
                        # time.sleep(5)
                        # driver.switch_to.window(driver.window_handles[-1])
                        # assert CREATOR_URL == self.driver.current_url
                        assert (Test_HealthCheck.SUT + "demo") in self.driver.current_url


            except AssertionError:
                pytest.fail("Test case failed")
            except NoSuchElementException:
                pytest.fail("Test case failed")
            except IndexError:
                pytest.fail("Test case failed")
            except NoSuchWindowException:
                pytest.fail("Test case failed")
            except ElementNotInteractableException:
                pytest.fail("Test case failed")
            except ElementClickInterceptedException:
                pytest.fail("Test case failed")
            except:
                print(traceback.format_exc())


        @pytest.mark.skip
        def test_ModifyTitle_UploadedDemoVideo(self):
            try:

                _t = None
                print("Running the Test Open Url")
                if _data['MITM'] == 'True':
                    print("Clearing Cache as flag is True")
                    c.clearCache()
                time.sleep(2)
                ######################### Using Proxy Service ##########################################

                driver = self.driver
                time.sleep(10)

                webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()
                try:
                    driver.find_element(By.XPATH, Locator.profile_dropdown).click()
                except:
                    print("### Exception ###")
                    driver.find_element(By.XPATH, Locator.profile_dropdown_hotdrops).click()
                else:
                    print("Nothing went wrong")

                # driver.find_element_by_xpath("//span[contains(.,'@suresh111')]").click()
                sleep(5)
                driver.find_element(By.XPATH, "//li[contains(.,'Upload')]").click()
                time.sleep(5)
                webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()
                time.sleep(5)

                # Changing title of  video
                # driver.find_element(By.XPATH, "//div[1]/div/div/div[3]/div[2]/div/div/div[2]/div/button[2]/i").click()

                pencil_icon = driver.find_element(By.CSS_SELECTOR, ".fa-pencil")
                #pencil_icon = driver.find_element("xpath", '//*[@class="svg-inline--fa fa-pencil "]')
                #pencil_icon = driver.find_element("xpath", '//*[@class="fas fa-pencil-alt"]')
                time.sleep(2)
                driver.execute_script("arguments[0].scrollIntoView();", pencil_icon)
                driver.execute_script("arguments[0].click();", pencil_icon)
                time.sleep(5)
                webdriver.ActionChains(driver).send_keys(Keys.TAB).perform()
                time.sleep(2)
                webdriver.ActionChains(driver).send_keys(Keys.BACKSPACE).perform()
                time.sleep(5)
                driver.find_element("xpath", "//input[@placeholder='Select a description']").send_keys("chg-title")
                #WebDriverWait(driver, 20).until(
                #    EC.element_to_be_clickable((By.XPATH, '//*[@class="form-control input-select-custom-style"]'))).send_keys(
                #    'chg_title')
                #driver.find_element("xpath", '//*[@class="form-control input-select-custom-style"]').send_keys("chg_title")
                time.sleep(2)
                driver.find_element("xpath", "//button[contains(.,'Update')]").click()

                # driver.find_element("xpath", '//*[@class="fas fa-trash"]').click()
                time.sleep(5)
                driver.switch_to.window(driver.window_handles[1])
                driver.find_element("xpath", "//button[contains(.,'OK')]").click()
                # driver.find_element(By.XPATH, "//div[5]/div/div[6]/button[1]").click()
                time.sleep(5)
                #webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()
                #time.sleep(5)
                driver.switch_to.window(driver.window_handles[-1])
                time.sleep(5)



            except AssertionError:
                pytest.fail("Test case failed")
            except NoSuchElementException:
                pytest.fail("Test case failed")
            except NoSuchWindowException:
                pytest.fail("Test case failed")
            except ElementNotInteractableException:
                pytest.fail("Test case failed")
            except:
                print(traceback.format_exc())

        @pytest.mark.skip
        def test_StreamDemoVideo_MVP(self):
                    try:

                        _t = None
                        print("Running the Test Open Url")
                        if _data['MITM'] == 'True':
                            print("Clearing Cache as flag is True")
                            c.clearCache()
                        time.sleep(2)
                        ######################### Using Proxy Service ##########################################

                        driver = self.driver
                        time.sleep(10)

                        FirstVideo = driver.find_element("xpath", '//img[@class="modal-content-play-image"]')
                        #FirstVideo = driver.find_element("xpath",
                        #                                 '//div[1]/div/div/div[3]/div[2]/div/div/div[2]/div/div[1]/img[1]')
                        driver.execute_script("arguments[0].scrollIntoView();", FirstVideo)
                        driver.execute_script("arguments[0].click();", FirstVideo)
                        time.sleep(5)
                        # driver.find_element("xpath", "//div/div/div/div[3]/div[2]/div/div/div[4]/div[2]/div").click()
                        # time.sleep(5)
                        driver.switch_to.window(driver.window_handles[-1])
                        time.sleep(5)

                        FirstVideo_popup = driver.find_element("xpath",
                                                         '//div[5]/div/div/div/div[1]/img[1]')
                        driver.execute_script("arguments[0].scrollIntoView();", FirstVideo_popup)
                        driver.execute_script("arguments[0].click();", FirstVideo_popup)
                        #webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()
                        #time.sleep(5)
                        #driver.switch_to.window(driver.window_handles[-1])
                        time.sleep(120)

                        substring = "0.ts"
                        # JavaScript command to traffic
                        r = driver.execute_script("return window.performance.getEntries();")
                        result = 0
                        for res in r:
                            if result != 1:
                                # print(res['name'])
                                fullstring = res['name']
                                print("%%%%%%%%%%%%%")
                                print(fullstring)
                                if fullstring != None and substring in fullstring:
                                    result = 1
                                    assert result == 1
                                    print("Found!")
                                    # Appending text to log file
                                    test_logs = open(SCREENSHOT_DIRECTORY + "TestExecutionLogs.txt", "w")
                                    test_case_name = os.environ.get('PYTEST_CURRENT_TEST').split(':')[-1].split(' ')[0]
                                    test_logs.write(
                                        Test_HealthCheck.dt_string + "," + test_case_name + "," + "Test case Passed" + "," + fullstring + "\n")
                                    test_logs.close()
                                else:
                                    result = 0
                                    print("Not found!")
                                    # Appending text to log file
                                    test_logs = open(SCREENSHOT_DIRECTORY + "TestExecutionLogs.txt", "w")
                                    test_case_name = os.environ.get('PYTEST_CURRENT_TEST').split(':')[-1].split(' ')[0]
                                    test_logs.write(
                                        Test_HealthCheck.dt_string + "," + test_case_name + "," + "Test case Failed" + "," + fullstring + "\n")
                                    test_logs.close()

                        # assert GREYMAN_URL == self.driver.current_url
                        webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()
                        time.sleep(5)
                        driver.switch_to.window(driver.window_handles[-1])
                        assert result == 1
                    
                    except AssertionError:
                        pytest.fail("Test case failed")
                    except NoSuchElementException:
                        pytest.fail("Test case failed")
                    except NoSuchWindowException:
                        pytest.fail("Test case failed")
                    except ElementNotInteractableException:
                        pytest.fail("Test case failed")
                    except:
                        print(traceback.format_exc())


        @pytest.mark.skip
        def test_Delete_DemoVideo_MVP(self):
                    try:

                        _t = None
                        print("Running the Test Open Url")
                        if _data['MITM'] == 'True':
                            print("Clearing Cache as flag is True")
                            c.clearCache()
                        time.sleep(2)
                        ######################### Using Proxy Service ##########################################

                        driver = self.driver
                        time.sleep(10)
                        webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()
                        time.sleep(5)
                        driver.switch_to.window(driver.window_handles[-1])

                        try:
                            driver.find_element(By.XPATH, Locator.profile_dropdown).click()
                        except:
                            print("### Exception ###")
                            driver.find_element(By.XPATH, Locator.profile_dropdown_hotdrops).click()
                        else:
                            print("Nothing went wrong")
                        #driver.find_element(By.XPATH, Locator.profile_dropdown_hotdrops).click()
                        # driver.find_element_by_xpath("//span[contains(.,'@suresh111')]").click()
                        sleep(5)
                        driver.find_element(By.XPATH, "//li[contains(.,'Upload')]").click()
                        time.sleep(5)
                        webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()
                        time.sleep(5)
                        driver.switch_to.window(driver.window_handles[-1])
                        time.sleep(5)
                        #Deletig video
                        #driver.find_element(By.XPATH, "//div[1]/div/div/div[3]/div[2]/div/div/div[2]/div/button[2]/i").click()
                        driver.find_element(By.XPATH, '//body').send_keys(Keys.CONTROL + Keys.HOME)
                        time.sleep(5)
                        trash_icon = driver.find_element(By.XPATH, '//*[@class="btn btn-danger rounded-rairo "]')
                        #trash_icon = driver.find_element(By.XPATH, '//*[@class="svg-inline--fa fa-trash "]')
                        #trash_icon = driver.find_element(By.XPATH, '//*[@id="App"]/div/div[3]/div[2]/div/div/div[2]/div/button[2]/svg/path')
                        time.sleep(2)
                        driver.execute_script("arguments[0].scrollIntoView();", trash_icon)
                        driver.execute_script("arguments[0].click();", trash_icon)

                        #driver.find_element("xpath", '//*[@class="fas fa-trash"]').click()
                        time.sleep(5)
                        driver.switch_to.window(driver.window_handles[1])
                        driver.find_element("xpath", "//button[contains(.,'Yes')]").click()
                        #driver.find_element(By.XPATH, "//div[5]/div/div[6]/button[1]").click()
                        time.sleep(5)
                        webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()
                        time.sleep(5)
                        driver.switch_to.window(driver.window_handles[-1])
                        time.sleep(5)
                        # Saving the Screenshot
                        driver.save_screenshot(SCREENSHOT_DIRECTORY + "Contract_ConfirmReject.png")
                        time.sleep(10)

                        # Opening the image & storing it in an image object
                        img = Image.open(SCREENSHOT_DIRECTORY + "Contract_ConfirmReject.png")
                        time.sleep(5)

                        # Size of the image in pixels (size of original image)
                        # (This is not mandatory)
                        width, height = img.size

                        # Setting the points for cropped image
                        left = 400
                        top = height / 8
                        right = 1200
                        bottom = 7 * height / 8

                        # Cropped image of above dimension
                        # (It will not change original image)
                        im1 = img.crop((left, top, right, bottom))
                        # Shows the image in image viewer
                        # im1.show()

                        # Passing the image object to image_to_string() function
                        # This function will extract the text from the image
                        text = pytesseract.image_to_string(im1)

                        # Modifying text
                        mod_text = text.rstrip()
                        without_line_breaks = mod_text.replace("\n", " ")

                        # Appending text to log file
                        test_logs = open(SCREENSHOT_DIRECTORY + "TestExecutionLogs.txt", "a")
                        test_case_name = os.environ.get('PYTEST_CURRENT_TEST').split(':')[-1].split(' ')[0]
                        test_logs.write(
                            Test_HealthCheck.dt_string + "," + test_case_name + "," + without_line_breaks + "\n")
                        test_logs.close()
                        # print(text[:-1])
                        time.sleep(5)

                        # driver.find_element_by_xpath('//button[text()="OK"]').click()
                        # print("driver.window_handles_final : " + str(self.driver.window_handles))
                        # time.sleep(5)
                        # driver.switch_to.window(driver.window_handles[-1])
                        # assert CREATOR_URL == self.driver.current_url
                        assert (Test_HealthCheck.SUT + "demo") in self.driver.current_url


                    except AssertionError:
                        pytest.fail("Test case failed")
                    except NoSuchElementException:
                        pytest.fail("Test case failed")
                    except ElementNotInteractableException:
                        pytest.fail("Test case failed")
                    except NoSuchWindowException:
                        pytest.fail("Test case failed")
                    except:
                        print(traceback.format_exc())

        @pytest.mark.skip
        def test_Upload_Video_MVP(self):
            try:

                        _t = None
                        print("Running the Test Open Url")
                        if _data['MITM'] == 'True':
                            print("Clearing Cache as flag is True")
                            c.clearCache()
                        time.sleep(2)
                        ######################### Using Proxy Service ##########################################

                        driver = self.driver
                        time.sleep(10)

                        # driver.find_element_by_xpath("//a[contains(@href, '/all')]").click()
                        sleep(10)
                        driver.find_element(By.XPATH, '//body').send_keys(Keys.CONTROL + Keys.HOME)
                        #driver.find_element_by_xpath("//div[@id='root']/div/div/div/div[3]/div/div[2]/div/div/button[2]").click()
                        try:
                            driver.find_element(By.XPATH, Locator.profile_dropdown_hotdrops).click()
                        except:
                            print("### Exception ###")
                            driver.find_element(By.XPATH, Locator.profile_dropdown).click()
                        else:
                            print("Nothing went wrong")
                        #driver.find_element(By.XPATH,Locator.profile_dropdown_hotdrops).click()
                        #driver.find_element_by_xpath("//span[contains(.,'@suresh111')]").click()
                        sleep(5)
                        driver.find_element(By.XPATH,"//li[contains(.,'Upload')]").click()
                        time.sleep(5)
                        webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()
                        # refresh page
                        driver.refresh()
                        time.sleep(25)
                        #Upload video
                        time.sleep(5)
                        driver.find_element("xpath", "//input[@type='file']").send_keys(VIDEO_UPLOAD_FILE)
                        time.sleep(5)
                        print("driver.window_handles : " + str(self.driver.window_handles))
                        driver.find_element("xpath", "//button[contains(.,'Select offer')]").click()
                        #driver.find_element("xpath", "//div[1]/div/div/div[3]/div[2]/div/div/div[2]/div/div[2]/div/div").click()
                        time.sleep(10)
                        webdriver.ActionChains(driver).send_keys(Keys.TAB).perform()
                        time.sleep(5)
                        webdriver.ActionChains(driver).send_keys(Keys.ARROW_DOWN).perform()
                        time.sleep(5)
                        webdriver.ActionChains(driver).send_keys(Keys.ARROW_RIGHT).perform()
                        time.sleep(5)
                        webdriver.ActionChains(driver).send_keys(Keys.ARROW_RIGHT).perform()
                        time.sleep(5)
                        webdriver.ActionChains(driver).send_keys(Keys.ARROW_RIGHT).perform()
                        time.sleep(5)
                        webdriver.ActionChains(driver).send_keys(Keys.TAB).perform()
                        time.sleep(5)
                        webdriver.ActionChains(driver).send_keys(Keys.ARROW_DOWN).perform()
                        time.sleep(5)
                        webdriver.ActionChains(driver).send_keys(Keys.ARROW_DOWN).perform()
                        time.sleep(5)
                        webdriver.ActionChains(driver).send_keys(Keys.TAB).perform()
                        time.sleep(5)
                        webdriver.ActionChains(driver).send_keys(Keys.ARROW_DOWN).perform()
                        time.sleep(5)
                        webdriver.ActionChains(driver).send_keys(Keys.ARROW_DOWN).perform()
                        time.sleep(5)
                        driver.find_element("xpath", "//button[contains(.,'Save')]").click()
                        time.sleep(5)
                        driver.find_element("xpath", "//button[contains(.,'Upload')]").click()
                        time.sleep(5)
                        driver.switch_to.window(driver.window_handles[-1])
                        time.sleep(5)
                        driver.find_element("xpath", "//button[contains(.,'Cloud')]").click()
                        time.sleep(120)
                        # refresh page
                        driver.refresh()
                        time.sleep(5)
                        # Saving the Screenshot
                        driver.save_screenshot(SCREENSHOT_DIRECTORY + "UploadVideo_MVP.png")
                        time.sleep(10)

                        # driver.find_element_by_xpath('//button[text()="OK"]').click()
                        # print("driver.window_handles_final : " + str(self.driver.window_handles))
                        # time.sleep(5)
                        # driver.switch_to.window(driver.window_handles[-1])
                        # assert CREATOR_URL == self.driver.current_url
                        assert (Test_HealthCheck.SUT + "demo") in self.driver.current_url


            except AssertionError:
                pytest.fail("Test case failed")
            except NoSuchElementException:
                pytest.fail("Test case failed")
            except IndexError:
                pytest.fail("Test case failed")
            except NoSuchWindowException:
                pytest.fail("Test case failed")
            except ElementNotInteractableException:
                pytest.fail("Test case failed")
            except ElementClickInterceptedException:
                pytest.fail("Test case failed")
            except:
                print(traceback.format_exc())


        @pytest.mark.skip
        def test_StreamVideo_Unlockables(self):
                    try:

                        _t = None
                        print("Running the Test Open Url")
                        if _data['MITM'] == 'True':
                            print("Clearing Cache as flag is True")
                            c.clearCache()
                        time.sleep(2)
                        ######################### Using Proxy Service ##########################################

                        driver = self.driver
                        time.sleep(10)
                        #driver.find_element("xpath", "//div[1]/div/div/div[1]/div[1]/div/img").click()
                        driver.find_element(By.XPATH, '//body').send_keys(Keys.CONTROL + Keys.HOME)
                        #driver.find_element("xpath", "//img[@alt='Rair Tech']").click()
                        driver.find_element(By.XPATH, "//img[@alt='Rair Tech']").click()
                        time.sleep(5)
                        driver.find_element("xpath", "//li[contains(.,'Videos')]").click()
                        time.sleep(5)
                        #driver.find_element("xpath", "//div[2]/div/div/div/div/input").send_keys("Fire")
                        #driver.find_element("xpath", '//*[@class="container-search"]/input').send_keys("1-automation")
                        driver.find_element("xpath", "//input[@placeholder='Search videos']").send_keys("george")
                        time.sleep(10)
                        #FirstVideo = driver.find_element("xpath",'//div[1]/div/div/div[3]/div[2]/div/div[2]/div/div/div/div[3]/div[2]/div[1]/button/div[1]/img[2]')
                        FirstVideo = driver.find_element("xpath", "//img[@alt='Animated video thumbnail']")
                        driver.execute_script("arguments[0].scrollIntoView();", FirstVideo)
                        driver.execute_script("arguments[0].click();", FirstVideo)
                        time.sleep(10)
                        # driver.find_element("xpath", "//div/div/div/div[3]/div[2]/div/div/div[4]/div[2]/div").click()
                        # time.sleep(5)
                        driver.switch_to.window(driver.window_handles[-1])

                        FirstVideo_popup = driver.find_element("xpath", "//img[@alt='Button play video']")
                        #FirstVideo_popup = driver.find_element("xpath",'//div[6]/div/div/div[2]/div[1]/img[1]')
                        driver.execute_script("arguments[0].scrollIntoView();", FirstVideo_popup)
                        driver.execute_script("arguments[0].click();", FirstVideo_popup)
                        #webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()
                        #time.sleep(5)
                        #driver.switch_to.window(driver.window_handles[-1])
                        time.sleep(100)

                        substring = "0.ts"
                        # JavaScript command to traffic
                        r = driver.execute_script("return window.performance.getEntries();")
                        result = 0
                        for res in r:
                            if result != 1:
                                # print(res['name'])
                                fullstring = res['name']
                                print("%%%%%%%%%%%%%")
                                print(fullstring)
                                if fullstring != None and substring in fullstring:
                                    result = 1
                                    assert result == 1
                                    print("Found!")
                                    # Appending text to log file
                                    test_logs = open(SCREENSHOT_DIRECTORY + "TestExecutionLogs.txt", "w")
                                    test_case_name = os.environ.get('PYTEST_CURRENT_TEST').split(':')[-1].split(' ')[0]
                                    test_logs.write(
                                        Test_HealthCheck.dt_string + "," + test_case_name + "," + "Test case Passed" + "," + fullstring + "\n")
                                    test_logs.close()
                                else:
                                    result = 0
                                    print("Not found!")
                                    # Appending text to log file
                                    test_logs = open(SCREENSHOT_DIRECTORY + "TestExecutionLogs.txt", "w")
                                    test_case_name = os.environ.get('PYTEST_CURRENT_TEST').split(':')[-1].split(' ')[0]
                                    test_logs.write(
                                        Test_HealthCheck.dt_string + "," + test_case_name + "," + "Test case Failed" + "," + fullstring + "\n")
                                    test_logs.close()

                        # assert GREYMAN_URL == self.driver.current_url
                        #webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()
                        #time.sleep(5)
                        #driver.switch_to.window(driver.window_handles[-1])
                        assert result == 1


                    except AssertionError:
                        pytest.fail("Test case failed")
                    except NoSuchElementException:
                        pytest.fail("Test case failed")
                    except NoSuchWindowException:
                        pytest.fail("Test case failed")
                    except ElementNotInteractableException:
                        pytest.fail("Test case failed")
                    except ElementClickInterceptedException:
                        pytest.fail("Test case failed")
                    except:
                        print(traceback.format_exc())


        @pytest.mark.skip
        def test_StreamVideo_SingleTokenView(self):
            try:

                _t = None
                print("Running the Test Open Url")
                if _data['MITM'] == 'True':
                    print("Clearing Cache as flag is True")
                    c.clearCache()
                time.sleep(2)
                ######################### Using Proxy Service ##########################################

                driver = self.driver
                time.sleep(10)
                driver.find_element("xpath", "//span[contains(.,'View Collection')]").click()
                #driver.find_element("xpath", "//div[6]/div/div/div[2]/div[2]/div[2]/div/div/span").click()
                #driver.find_element("xpath", "sc-ftvSup lkCoVD CustomButton_nftDataPageShowMoreText__3S0Ai").click()
                time.sleep(5)
                driver.switch_to.window(driver.window_handles[-1])
                time.sleep(10)
                #driver.find_element("xpath", "//div[1]/div/div/div[3]/div[2]/div/div[3]/div/div[1]/div/div[2]/div[2]/span[2]").click()
                #time.sleep(5)
                #FirstNFT = driver.find_element("xpath", '//div[1]/div[2]/div/div[3]/div[2]/div/div[4]/div/div[1]/div/div[2]/div[2]/span[2]')
                #FirstNFT = driver.find_element("xpath",'//img[@alt="NFT token"]')
                #FirstNFT = driver.find_element("xpath", '//img[@alt="NFT token"]')
                FirstNFT = driver.find_element("xpath", '//div[@id="App"]/div/div[3]/div[2]/div/div[4]/div/div/div/img')
                driver.execute_script("arguments[0].scrollIntoView();", FirstNFT)
                time.sleep(5)
                ##
                a = ActionChains(driver)
                m = driver.find_element("xpath", '//div[1]/div[2]/div/div[3]/div[2]/div/div[4]/div/div[1]/div/div/div[1]')
                # hover over element
                a.move_to_element(m).perform()
                time.sleep(10)
                # identify sub menu element
                SubMenu = driver.find_element("xpath", '//div[1]/div[2]/div/div[3]/div[2]/div/div[4]/div/div[1]/div/div/div[2]/span[2]')
                # hover over element and click
                time.sleep(10)
                a.move_to_element(SubMenu).click().perform()
                time.sleep(5)
                ###

                #driver.execute_script("arguments[0].click();", FirstNFT)
                time.sleep(10)
                # driver.find_element("xpath", "//div/div/div/div[3]/div[2]/div/div/div[4]/div[2]/div").click()
                # time.sleep(5)
                #driver.switch_to.window(driver.window_handles[-1])

                #FirstVideo_popup = driver.find_element("xpath", '//div[1]/div/div/div[3]/div[2]/main/div[2]/div[4]/div/div[1]/img')
                FirstVideo_popup = driver.find_element("xpath", '//div[5]/div/div/img')
                driver.execute_script("arguments[0].scrollIntoView();", FirstVideo_popup)
                driver.execute_script("arguments[0].click();", FirstVideo_popup)
                # webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()
                # time.sleep(5)
                # driver.switch_to.window(driver.window_handles[-1])
                time.sleep(30)

                substring = "0.ts"
                # JavaScript command to traffic
                r = driver.execute_script("return window.performance.getEntries();")
                result = 0
                for res in r:
                    if result != 1:
                        # print(res['name'])
                        fullstring = res['name']
                        print("%%%%%%%%%%%%%")
                        print(fullstring)
                        if fullstring != None and substring in fullstring:
                            result = 1
                            assert result == 1
                            print("Found!")
                            # Appending text to log file
                            test_logs = open(SCREENSHOT_DIRECTORY + "TestExecutionLogs.txt", "w")
                            test_case_name = os.environ.get('PYTEST_CURRENT_TEST').split(':')[-1].split(' ')[0]
                            test_logs.write(
                                Test_HealthCheck.dt_string + "," + test_case_name + "," + "Test case Passed" + "," + fullstring + "\n")
                            test_logs.close()
                        else:
                            result = 0
                            print("Not found!")
                            # Appending text to log file
                            test_logs = open(SCREENSHOT_DIRECTORY + "TestExecutionLogs.txt", "w")
                            test_case_name = os.environ.get('PYTEST_CURRENT_TEST').split(':')[-1].split(' ')[0]
                            test_logs.write(
                                Test_HealthCheck.dt_string + "," + test_case_name + "," + "Test case Failed" + "," + fullstring + "\n")
                            test_logs.close()

                # assert GREYMAN_URL == self.driver.current_url

                webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()
                time.sleep(5)
                driver.switch_to.window(driver.window_handles[-1])
                time.sleep(5)
                assert result == 1


            except AssertionError:
                pytest.fail("Test case failed")
            except NoSuchElementException:
                pytest.fail("Test case failed")
            except NoSuchWindowException:
                pytest.fail("Test case failed")
            except ElementNotInteractableException:
                pytest.fail("Test case failed")
            except IndexError:
                pytest.fail("Test case failed")
            except:
                print(traceback.format_exc())

        @pytest.mark.skip
        def test_Delete_Video_MVP(self):
                    try:

                        _t = None
                        print("Running the Test Open Url")
                        if _data['MITM'] == 'True':
                            print("Clearing Cache as flag is True")
                            c.clearCache()
                        time.sleep(2)
                        ######################### Using Proxy Service ##########################################

                        driver = self.driver
                        time.sleep(10)

                        #driver.find_element(By.XPATH, Locator.profile_dropdown_hotdrops).click()
                        try:
                            driver.find_element(By.XPATH, Locator.profile_dropdown_hotdrops).click()
                        except:
                            print("### Exception ###")
                            driver.find_element(By.XPATH, Locator.profile_dropdown).click()
                        else:
                            print("Nothing went wrong")
                        # driver.find_element_by_xpath("//span[contains(.,'@suresh111')]").click()
                        sleep(5)
                        driver.find_element(By.XPATH, "//li[contains(.,'Upload')]").click()
                        time.sleep(5)
                        webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()
                        time.sleep(5)
                        #Deletig video
                        #driver.find_element(By.XPATH, "//div[1]/div/div/div[3]/div[2]/div/div/div[2]/div/button[2]/i").click()

                        trash_icon = driver.find_element("xpath", '//*[@class="fas fa-trash"]')
                        time.sleep(2)
                        driver.execute_script("arguments[0].scrollIntoView();", trash_icon)
                        driver.execute_script("arguments[0].click();", trash_icon)

                        #driver.find_element("xpath", '//*[@class="fas fa-trash"]').click()
                        time.sleep(5)
                        driver.switch_to.window(driver.window_handles[1])
                        driver.find_element("xpath", "//button[contains(.,'Yes')]").click()
                        #driver.find_element(By.XPATH, "//div[5]/div/div[6]/button[1]").click()
                        time.sleep(5)
                        webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()
                        time.sleep(5)
                        driver.switch_to.window(driver.window_handles[-1])
                        time.sleep(5)
                        # Saving the Screenshot
                        driver.save_screenshot(SCREENSHOT_DIRECTORY + "Contract_ConfirmReject.png")
                        time.sleep(10)

                        # Opening the image & storing it in an image object
                        img = Image.open(SCREENSHOT_DIRECTORY + "Contract_ConfirmReject.png")
                        time.sleep(5)

                        # Size of the image in pixels (size of original image)
                        # (This is not mandatory)
                        width, height = img.size

                        # Setting the points for cropped image
                        left = 400
                        top = height / 8
                        right = 1200
                        bottom = 7 * height / 8

                        # Cropped image of above dimension
                        # (It will not change original image)
                        im1 = img.crop((left, top, right, bottom))
                        # Shows the image in image viewer
                        # im1.show()

                        # Passing the image object to image_to_string() function
                        # This function will extract the text from the image
                        text = pytesseract.image_to_string(im1)

                        # Modifying text
                        mod_text = text.rstrip()
                        without_line_breaks = mod_text.replace("\n", " ")

                        # Appending text to log file
                        test_logs = open(SCREENSHOT_DIRECTORY + "TestExecutionLogs.txt", "a")
                        test_case_name = os.environ.get('PYTEST_CURRENT_TEST').split(':')[-1].split(' ')[0]
                        test_logs.write(
                            Test_HealthCheck.dt_string + "," + test_case_name + "," + without_line_breaks + "\n")
                        test_logs.close()
                        # print(text[:-1])
                        time.sleep(5)

                        # driver.find_element_by_xpath('//button[text()="OK"]').click()
                        # print("driver.window_handles_final : " + str(self.driver.window_handles))
                        # time.sleep(5)
                        # driver.switch_to.window(driver.window_handles[-1])
                        # assert CREATOR_URL == self.driver.current_url
                        assert (Test_HealthCheck.SUT + "demo") in self.driver.current_url


                    except AssertionError:
                        pytest.fail("Test case failed")
                    except NoSuchElementException:
                        pytest.fail("Test case failed")
                    except ElementNotInteractableException:
                        pytest.fail("Test case failed")
                    except ElementClickInterceptedException:
                        pytest.fail("Test case failed")
                    except NoSuchWindowException:
                        pytest.fail("Test case failed")
                    except:
                        print(traceback.format_exc())


        @pytest.mark.skip
        def test_MintToken_EasyMint(self):
                    try:

                        _t = None
                        print("Running the Test Open Url")
                        if _data['MITM'] == 'True':
                            print("Clearing Cache as flag is True")
                            c.clearCache()
                        time.sleep(2)
                        ######################### Using Proxy Service ##########################################

                        driver = self.driver
                        time.sleep(10)
                        #driver.find_element("xpath", "//div[1]/div/div/div[1]/div[1]/div/img").click()
                        driver.find_element("xpath", "//img[@alt='Rair Tech']").click()
                        time.sleep(5)
                        #driver.find_element("xpath", "//li[contains(.,'NFT')]").click()
                        time.sleep(10)
                        # refresh page
                        driver.refresh()
                        time.sleep(25)
                        try:
                            driver.find_element("xpath", "//input[@placeholder='Search']").send_keys(Keys.RETURN)
                        except:
                            print("### Exception ###")
                            driver.find_element("xpath", "//input[@placeholder='Search the rairverse...']").send_keys(Keys.RETURN)
                            time.sleep(5)
                            driver.find_element("xpath", "//input[@placeholder='Search the rairverse...']").send_keys(Test_HealthCheck.SEARCH_CONTRACT)
                        else:
                            time.sleep(5)
                            time.sleep(5)
                            driver.find_element("xpath", "//input[@placeholder='Search']").send_keys(Test_HealthCheck.SEARCH_CONTRACT)
                            print("Nothing went wrong")

                        time.sleep(20)
                        driver.find_element("xpath", "//div[1]/div/div/div[1]/div[2]/div/div/div/div[1]/div/p").click()
                        time.sleep(10)
                        driver.switch_to.window(driver.window_handles[-1])
                        time.sleep(5)
                        #EasyMint = driver.find_element("xpath", "//button[contains(.,'Mint')]")
                        EasyMint = driver.find_element("xpath", "//div[1]/div/div/div[3]/div[2]/div/div[3]/div/div[2]/div[1]/div/span")
                        time.sleep(5)
                        driver.execute_script("arguments[0].scrollIntoView();", EasyMint)
                        driver.execute_script("arguments[0].click();", EasyMint)
                        time.sleep(5)
                        driver.find_element("xpath", "//button[contains(.,'Buy')]").click()
                        time.sleep(5)
                        driver.find_element("xpath", "//button[contains(.,'Switch')]").click()
                        #driver.find_element("xpath", '//button[text()="Switch to Matic(Polygon) Testnet"]').click()
                        time.sleep(10)
                        # Switch network
                        driver.switch_to.window(driver.window_handles[-1])
                        time.sleep(15)
                        try:
                            driver.find_element("xpath", "//button[contains(.,'Approve')]").click()
                        except:
                            print("### Exception ###")
                        else:
                            print("Nothing went wrong")
                        time.sleep(10)
                        print("driver.window_handles_network : " + str(self.driver.window_handles))
                        driver.switch_to.window(driver.window_handles[-1])
                        time.sleep(10)
                        driver.find_element("xpath", "//button[contains(.,'Switch network')]").click()
                        time.sleep(10)
                        driver.switch_to.window(driver.window_handles[-1])
                        #driver.execute_script("arguments[0].scrollIntoView();", EasyMint)
                        #driver.execute_script("arguments[0].click();", EasyMint)
                        #time.sleep(5)
                        #driver.find_element("xpath", "//button[contains(.,'Buy')]").click()
                        #time.sleep(5)
                        driver.find_element("xpath", "//button[contains(.,'Purchase')]").click()
                        print("Purchase Button clicked")
                        #driver.find_element("xpath", '//button[text()="Purchase"]').click()
                        time.sleep(25)

                        # Saving the Screenshot
                        #saveScreenshot(self, "EasyMint_clickPurchase.png")
                        driver.save_screenshot(SCREENSHOT_DIRECTORY + "EasyMint_clickPurchase.png")
                        #time.sleep(5)
                        driver.switch_to.window(driver.window_handles[-1])
                        #time.sleep(10)


                        try:
                            print("driver.window_handles_Purchase_clicked : " + str(self.driver.window_handles))
                            time.sleep(10)
                            token_confirm = driver.find_element("xpath","//button[contains(.,'Reject')]")
                            driver.execute_script("arguments[0].scrollIntoView();", token_confirm)
                            time.sleep(10)
                            token_confirm_enabled = WebDriverWait(driver, 20).until(
                                EC.element_to_be_clickable((By.XPATH, "//button[contains(.,'Confirm')]")))
                            driver.execute_script("arguments[0].click();", token_confirm_enabled)
                            time.sleep(100)
                            print("driver.window_handles_token_minted : " + str(self.driver.window_handles))
                            driver.switch_to.window(driver.window_handles[-1])
                            time.sleep(5)

                            mint_status = driver.find_element("xpath", '//*[@id="swal2-title"]').text
                            print(mint_status)

                            # Extracting next token number
                            mint_message = driver.find_element("xpath", '//*[@id="swal2-html-container"]').text
                            print(mint_message)

                            driver.find_element("xpath", '//button[text()="OK"]').click()
                            print("driver.window_handles_updated_final : " + str(self.driver.window_handles))
                            time.sleep(10)
                            webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()
                            # driver.find_element_by_tag_name('body').send_keys(Keys.ESCAPE)

                            Test_HealthCheck.redirected_url = self.driver.current_url
                            redirected_url_split = Test_HealthCheck.redirected_url.split("/")

                            if "token" in mint_message:
                                _token = re.findall(r'\b\d+\b', mint_message)
                                __token = _token[0]
                                token = int(__token)
                                Test_HealthCheck.next_token = token + 1
                                Test_HealthCheck.next_token_index = Test_HealthCheck.next_token + 1
                                print(Test_HealthCheck.next_token_index)
                            else:
                                __token = redirected_url_split[7]
                                Test_HealthCheck_token = int(__token)
                                print(Test_HealthCheck_token)
                                Test_HealthCheck.next_token = Test_HealthCheck_token + 1
                                Test_HealthCheck.next_token_index = Test_HealthCheck.next_token + 1
                                print(Test_HealthCheck.next_token_index)
                                print("token# missing in message")
                            ###

                        except NoSuchElementException:
                            time.sleep(5)
                            webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()
                            time.sleep(5)
                            webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()
                        except ElementNotInteractableException:
                            pytest.fail("Test case failed")
                        except:
                            print(traceback.format_exc())

                        assert mint_status == "Success"
                        #webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()
                        #time.sleep(5)
                        #driver.switch_to.window(driver.window_handles[-1])
                        #assert result == 1


                    except AssertionError:
                        pytest.fail("Test case failed")
                    except NoSuchElementException:
                        pytest.fail("Test case failed")
                    except NoSuchWindowException:
                        pytest.fail("Test case failed")
                    except ElementNotInteractableException:
                        pytest.fail("Test case failed")
                    except IndexError:
                        pytest.fail("Test case failed")
                    except UnboundLocalError:
                        pytest.fail("Test case failed")
                    except TimeoutException:
                        pytest.fail("Test case failed")
                    except ElementClickInterceptedException:
                        pytest.fail("Test case failed")
                    except:
                        print(traceback.format_exc())


        @pytest.mark.skip
        def test_CreateResaleOffer_SingleTokenView(self):
                    try:

                        _t = None
                        print("Running the Test Open Url")
                        if _data['MITM'] == 'True':
                            print("Clearing Cache as flag is True")
                            c.clearCache()
                        time.sleep(2)
                        ######################### Using Proxy Service ##########################################


                        driver = self.driver
                        time.sleep(2)
                        driver.switch_to.window(driver.window_handles[-1])
                        time.sleep(2)
                        resaleOffer_button = driver.find_element("xpath", "//div[1]/div/div/div[3]/div[2]/main/div[3]/div[3]/div[2]/button")
                        driver.execute_script("arguments[0].scrollIntoView();", resaleOffer_button)
                        time.sleep(2)
                        driver.execute_script("arguments[0].click();", resaleOffer_button)
                        #driver.find_element("xpath", "//div[1]/div/div/div[3]/div[2]/main/div[3]/div[3]/div[2]/button").click()
                        time.sleep(5)
                        driver.switch_to.window(driver.window_handles[-1])
                        time.sleep(5)
                        driver.find_element("xpath", "//input[@placeholder='Your price']").send_keys(Keys.RETURN)
                        time.sleep(2)
                        driver.find_element("xpath", "//input[@placeholder='Your price']").send_keys("0.002")
                        time.sleep(2)
                        driver.find_element("xpath", "//div[@id='swal2-html-container']/div/div[3]/button/span").click()
                        #driver.find_element("xpath", '//*[@class="nft-item-sell-buton"]').click()
                        #driver.find_element("xpath", '//button[text()="Sell"]').click()
                        time.sleep(2)
                        #driver.find_element("xpath", "//button[contains(.,'Sell')]").click()
                        #driver.find_element("xpath", "//div[@id='swal2-html-container']/div/div[3]/button/span").click()
                        time.sleep(4)
                        driver.switch_to.window(driver.window_handles[-1])
                        driver.find_element("xpath", "//button[contains(.,'OK')]").click()
                        time.sleep(2)
                        driver.switch_to.window(driver.window_handles[-1])
                        time.sleep(2)
                        #assert result == 1


                    except AssertionError:
                        pytest.fail("Test case failed")
                    except NoSuchElementException:
                        pytest.fail("Test case failed")
                    except NoSuchWindowException:
                        pytest.fail("Test case failed")
                    except ElementNotInteractableException:
                        pytest.fail("Test case failed")
                    except ElementClickInterceptedException:
                        pytest.fail("Test case failed")
                    except IndexError:
                        pytest.fail("Test case failed")
                    except:
                        print(traceback.format_exc())


        @pytest.mark.skip
        def test_AddFavorite(self):
            try:

                _t = None
                print("Running the Test Open Url")
                if _data['MITM'] == 'True':
                    print("Clearing Cache as flag is True")
                    c.clearCache()
                time.sleep(2)
                ######################### Using Proxy Service ##########################################

                driver = self.driver
                time.sleep(10)
                # driver.find_element("xpath", "//div[1]/div/div/div[1]/div[1]/div/img").click()
                driver.find_element("xpath", "//img[@alt='Rair Tech']").click()
                time.sleep(5)
                # driver.find_element("xpath", "//li[contains(.,'NFT')]").click()
                # time.sleep(10)
                # refresh page
                driver.refresh()
                time.sleep(5)
                try:
                    driver.find_element("xpath", "//input[@placeholder='Search']").send_keys(Keys.RETURN)
                except:
                    print("### Exception ###")
                    driver.find_element("xpath", "//input[@placeholder='Search the rairverse...']").send_keys(
                        Keys.RETURN)
                    time.sleep(5)
                    driver.find_element("xpath", "//input[@placeholder='Search the rairverse...']").send_keys(
                        Test_HealthCheck.SEARCH_CONTRACT)
                else:
                    time.sleep(5)
                    time.sleep(5)
                    driver.find_element("xpath", "//input[@placeholder='Search']").send_keys(Test_HealthCheck.SEARCH_CONTRACT)
                    print("Nothing went wrong")

                time.sleep(20)
                driver.find_element("xpath", "//div[1]/div/div/div[1]/div[2]/div/div/div/div[1]/div/p").click()
                time.sleep(10)
                driver.switch_to.window(driver.window_handles[-1])
                time.sleep(5)
                #print(Test_HealthCheck.next_token_index)
                #i = Test_HealthCheck.next_token_index
                i = 1
                #driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                #time.sleep(30)
                tile_iterator = "//div[@id='App']/div/div[3]/div[2]/div/div[4]/div/div[" + str(i) + "]/div/img"
                # tile_iterator = "//div/div/div/div[3]/div[2]/div/div[3]/div/div[" + str(i) + "]/div/div[2]/div[2]/span[2]"
                tile = driver.find_element("xpath", tile_iterator)
                time.sleep(5)
                driver.execute_script("arguments[0].scrollIntoView();", tile)
                time.sleep(5)

                a = ActionChains(driver)
                m = driver.find_element("xpath", '//div[1]/div[2]/div/div[3]/div[2]/div/div[4]/div/div[2]/div/div')
                # hover over element
                a.move_to_element(m).perform()
                time.sleep(10)
                # identify sub menu element
                FirstNFT = driver.find_element("xpath", '//div[1]/div[2]/div/div[3]/div[2]/div/div[4]/div/div[2]/div/div/div[2]/span[2]')
                # hover over element and click
                time.sleep(10)
                a.move_to_element(FirstNFT).click().perform()
                time.sleep(5)
                ###
                time.sleep(5)
                favorite_icon = driver.find_element("xpath", "//*[@class='nft-collection-icons-icon']/i")
                driver.execute_script("arguments[0].scrollIntoView();", favorite_icon)
                driver.execute_script("arguments[0].click();", favorite_icon)
                time.sleep(5)

                #assert mint_status == "Success"
                # webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()
                # time.sleep(5)
                # driver.switch_to.window(driver.window_handles[-1])
                # assert result == 1


            except AssertionError:
                pytest.fail("Test case failed")
            except NoSuchElementException:
                pytest.fail("Test case failed")
            except NoSuchWindowException:
                pytest.fail("Test case failed")
            except ElementNotInteractableException:
                pytest.fail("Test case failed")
            except ElementClickInterceptedException:
                pytest.fail("Test case failed")
            except IndexError:
                pytest.fail("Test case failed")
            except:
                print(traceback.format_exc())

        @pytest.mark.skip
        def test_RemoveFavorite(self):
                    try:

                        _t = None
                        print("Running the Test Open Url")
                        if _data['MITM'] == 'True':
                            print("Clearing Cache as flag is True")
                            c.clearCache()
                        time.sleep(2)
                        ######################### Using Proxy Service ##########################################

                        driver = self.driver
                        time.sleep(10)

                        # driver.find_element_by_xpath("//a[contains(@href, '/all')]").click()
                        sleep(10)
                        #driver.find_element(By.XPATH, Locator.profile_dropdown_hotdrops).click()
                        try:
                            driver.find_element(By.XPATH, Locator.profile_dropdown_hotdrops).click()
                        except:
                            print("### Exception ###")
                            driver.find_element(By.XPATH, Locator.profile_dropdown).click()
                        else:
                            print("Nothing went wrong")
                        sleep(5)
                        driver.find_element(By.XPATH, "//li[contains(.,'Profile settings')]").click()
                        time.sleep(5)
                        driver.switch_to.window(driver.window_handles[-1])
                        time.sleep(5)
                        #driver.find_element("xpath", '//*[@class="profile-input-edit btn"]').click()
                        #time.sleep(10)
                        #webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()
                        time.sleep(2)
                        driver.find_element("xpath", "//li[contains(.,'Favorited')]").click()
                        time.sleep(5)
                        heart = driver.find_element("xpath", '//*[@class="fas fa-heart like-button"]')
                        #driver.find_element("xpath", "//div[@id='App']/div/div[3]/div[2]/div/div[5]/div/div[2]/div[3]/div/div/div[1]/div/button/i").click()
                        driver.execute_script("arguments[0].scrollIntoView();", heart)
                        driver.execute_script("arguments[0].click();", heart)
                        time.sleep(2)
                        driver.switch_to.window(driver.window_handles[-1])
                        time.sleep(2)
                        driver.find_element("xpath", "//button[contains(.,'Remove')]").click()
                        time.sleep(2)



                        # driver.find_element_by_xpath('//button[text()="OK"]').click()
                        # print("driver.window_handles_final : " + str(self.driver.window_handles))
                        # time.sleep(5)
                        # driver.switch_to.window(driver.window_handles[-1])
                        #assert NEW_DEV_URL + Locator.public_key == self.driver.current_url
                        # assert (NEW_DEV_URL) in self.driver.current_url


                    except AssertionError:
                        pytest.fail("Test case failed")
                    except NoSuchElementException:
                        pytest.fail("Test case failed")
                    except NoSuchWindowException:
                        pytest.fail("Test case failed")
                    except ElementNotInteractableException:
                        pytest.fail("Test case failed")
                    except ElementClickInterceptedException:
                        pytest.fail("Test case failed")
                    except:
                        print(traceback.format_exc())

        @pytest.mark.skip
        def test_MintToken_SingleTokenView(self):
                    try:

                        _t = None
                        print("Running the Test Open Url")
                        if _data['MITM'] == 'True':
                            print("Clearing Cache as flag is True")
                            c.clearCache()
                        time.sleep(2)
                        ######################### Using Proxy Service ##########################################


                        driver = self.driver
                        time.sleep(10)
                        #Test_HealthCheck.next_token_index = 111
                        #driver.find_element("xpath", "//div[1]/div/div/div[1]/div[1]/div/img").click()
                        driver.find_element("xpath", "//img[@alt='Rair Tech']").click()
                        time.sleep(5)
                        #driver.find_element("xpath", "//li[contains(.,'NFT')]").click()
                        #time.sleep(10)
                        # refresh page
                        driver.refresh()
                        time.sleep(5)

                        try:
                            driver.find_element("xpath", "//input[@placeholder='Search']").send_keys(Keys.RETURN)
                        except:
                            print("### Exception ###")
                            driver.find_element("xpath", "//input[@placeholder='Search the rairverse...']").send_keys(Keys.RETURN)
                            time.sleep(5)
                            driver.find_element("xpath", "//input[@placeholder='Search the rairverse...']").send_keys("10012024")
                        else:
                            time.sleep(5)
                            time.sleep(5)
                            driver.find_element("xpath", "//input[@placeholder='Search']").send_keys("10012024")
                            print("Nothing went wrong")
                            print("#### Because of Bug in Application ####")
                            time.sleep(15)
                            driver.find_element("xpath",
                                                "//div[1]/div/div/div[1]/div[2]/div/div/div/div[1]/div/p").click()
                            time.sleep(5)
                            driver.switch_to.window(driver.window_handles[-1])
                            time.sleep(5)
                            tile_iterator = "//div[@id='App']/div/div[3]/div[2]/div/div[4]/div/div[1]/div/img"
                            # tile_iterator = "//div/div/div/div[3]/div[2]/div/div[3]/div/div[" + str(i) + "]/div/div[2]/div[2]/span[2]"
                            tile = driver.find_element("xpath", tile_iterator)
                            time.sleep(5)
                            driver.execute_script("arguments[0].scrollIntoView();", tile)
                            driver.execute_script("arguments[0].click();", tile)
                            time.sleep(5)
                            driver.find_element("xpath", "//img[@alt='Rair Tech']").click()
                            time.sleep(2)
                            driver.refresh()
                            time.sleep(2)
                            driver.find_element("xpath", "//input[@placeholder='Search']").send_keys(Keys.RETURN)
                            time.sleep(2)
                            driver.find_element("xpath", "//input[@placeholder='Search']").send_keys("10012024")


                        time.sleep(20)
                        driver.find_element("xpath", "//div[1]/div/div/div[1]/div[2]/div/div/div/div[1]/div/p").click()
                        time.sleep(10)
                        driver.switch_to.window(driver.window_handles[-1])
                        time.sleep(5)

                        print(Test_HealthCheck.next_token_index)
                        i = Test_HealthCheck.next_token_index
                        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                        time.sleep(10)
                        tile_iterator = "//div[@id='App']/div/div[3]/div[2]/div/div[4]/div/div[" + str(i) + "]/div/img"
                        #tile_iterator = "//div/div/div/div[3]/div[2]/div/div[3]/div/div[" + str(i) + "]/div/div[2]/div[2]/span[2]"
                        tile = driver.find_element("xpath", tile_iterator)
                        time.sleep(5)
                        driver.execute_script("arguments[0].scrollIntoView();", tile)
                        driver.execute_script("arguments[0].click();", tile)
                        time.sleep(10)
                        mint_button = driver.find_element("xpath", "//div[1]/div/div/div[3]/div[2]/main/div[3]/div[2]/div[2]/div[2]/button/span")
                        mint_button_text = (mint_button).text
                        #mint_button_text = driver.find_element("xpath", "//div[1]/div/div/div[3]/div[2]/main/div[2]/div[2]/div[2]/div[2]/button/span").text
                        if "Switch" in mint_button_text:
                            driver.execute_script("arguments[0].scrollIntoView();", mint_button)
                            driver.execute_script("arguments[0].click();", mint_button)
                            #driver.find_element("xpath", "//div[1]/div/div/div[3]/div[2]/main/div[2]/div[2]/div[2]/div[2]/button/span").click()
                            time.sleep(10)
                            # Switch network
                            driver.switch_to.window(driver.window_handles[-1])
                            time.sleep(15)
                            #driver.find_element("xpath", "//button[contains(.,'Approve')]").click()
                            #time.sleep(10)
                            #print("driver.window_handles_network : " + str(self.driver.window_handles))
                            #driver.switch_to.window(driver.window_handles[-1])
                            #time.sleep(10)
                            driver.find_element("xpath", "//button[contains(.,'Switch network')]").click()
                            time.sleep(5)
                            driver.switch_to.window(driver.window_handles[-1])
                            #driver.refresh()
                        else:
                            print("already on correct network")
                        time.sleep(5)
                        driver.execute_script("arguments[0].scrollIntoView();", mint_button)
                        driver.execute_script("arguments[0].click();", mint_button)
                        time.sleep(20)

                        # Saving the Screenshot
                        #saveScreenshot(self, "Greyman_clickPurchase.png")
                        #time.sleep(5)
                        driver.switch_to.window(driver.window_handles[-1])
                        #time.sleep(10)


                        try:
                            print("driver.window_handles_before_minted_1 : " + str(self.driver.window_handles))
                            token_confirm = driver.find_element("xpath","//button[contains(.,'Reject')]")
                            driver.execute_script("arguments[0].scrollIntoView();", token_confirm)
                            time.sleep(10)
                            token_confirm_enabled = WebDriverWait(driver, 30).until(
                                EC.element_to_be_clickable((By.XPATH, "//button[contains(.,'Confirm')]")))
                            driver.execute_script("arguments[0].click();", token_confirm_enabled)
                            time.sleep(60)
                            print("driver.window_handles_token_minted : " + str(self.driver.window_handles))
                            driver.switch_to.window(driver.window_handles[-1])
                            time.sleep(5)

                            mint_status = driver.find_element("xpath", '//*[@id="swal2-title"]').text
                            print(mint_status)

                            driver.find_element("xpath", '//button[text()="OK"]').click()
                            print("driver.window_handles_updated_final : " + str(self.driver.window_handles))
                            time.sleep(10)
                            webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()
                            # driver.find_element_by_tag_name('body').send_keys(Keys.ESCAPE)

                        except NoSuchElementException:
                            time.sleep(5)
                            webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()
                            time.sleep(5)
                            webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()
                        except ElementNotInteractableException:
                            pytest.fail("Test case failed")
                        except:
                            print(traceback.format_exc())

                        assert mint_status == "Success"
                        #webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()
                        #time.sleep(5)
                        #driver.switch_to.window(driver.window_handles[-1])
                        #assert result == 1


                    except AssertionError:
                        pytest.fail("Test case failed")
                    except NoSuchElementException:
                        pytest.fail("Test case failed")
                    except NoSuchWindowException:
                        pytest.fail("Test case failed")
                    except ElementNotInteractableException:
                        pytest.fail("Test case failed")
                    except ElementClickInterceptedException:
                        pytest.fail("Test case failed")
                    except IndexError:
                        pytest.fail("Test case failed")
                    except:
                        print(traceback.format_exc())


        @pytest.mark.skip
        def test_FilterLabels(self):
            try:

                _t = None
                print("Running the Test Open Url")
                if _data['MITM'] == 'True':
                    print("Clearing Cache as flag is True")
                    c.clearCache()
                time.sleep(2)
                ######################### Using Proxy Service ##########################################

                driver = self.driver
                time.sleep(10)

                #driver.find_element("xpath", "//div[1]/div/div/div[1]/div[1]/div/img").click()
                driver.find_element("xpath", "//img[@alt='Rair Tech']").click()
                time.sleep(5)

                # refresh page
                driver.refresh()
                time.sleep(10)

                driver.find_element("xpath", '//div[@id="home-page-modal-filter"]/div/div[2]/div/div[2]').click()
                driver.find_element("xpath", '//div[@id="home-page-modal-filter"]/div/div/div/div[2]').click()
                #filter_labels = driver.find_elements(By.XPATH, "//input")
                filter_labels = driver.find_elements(By.XPATH, '//span[@class="dropdown-option-text"]')
                print(len(filter_labels))
                result = 1
                k = 0
                for ff in range(len(filter_labels)):
                    if result == 1:
                        print(filter_labels[ff].text)
                        print(Expected_Filter_Labels[k])
                        #label = f'Filter_Label_{k}'
                        if ((filter_labels[ff].text) == Expected_Filter_Labels[k]):
                            result = 1
                            k = k + 1
                        else:
                            result = 0
                            assert result == 1
                            #pytest.fail("Test case failed")
                    else:
                        print("Test case Failed")


                # Saving the Screenshot
                driver.save_screenshot(SCREENSHOT_DIRECTORY + "Filter_Block.png")
                time.sleep(5)

                # driver.find_element_by_xpath('//button[text()="OK"]').click()
                # print("driver.window_handles_final : " + str(self.driver.window_handles))
                # time.sleep(5)
                # driver.switch_to.window(driver.window_handles[-1])
                #assert (NEW_DEV_URL) in self.driver.current_url


            except AssertionError:
                pytest.fail("Test case failed")
            except NoSuchElementException:
                pytest.fail("Test case failed")
            except NoSuchWindowException:
                pytest.fail("Test case failed")
            except ElementNotInteractableException:
                pytest.fail("Test case failed")
            except ElementClickInterceptedException:
                pytest.fail("Test case failed")
            except:
                print(traceback.format_exc())


        @pytest.mark.skip
        def test_Profile(self):
            try:

                _t = None
                print("Running the Test Open Url")
                if _data['MITM'] == 'True':
                    print("Clearing Cache as flag is True")
                    c.clearCache()
                time.sleep(2)
                ######################### Using Proxy Service ##########################################

                driver = self.driver
                time.sleep(10)

                # driver.find_element_by_xpath("//a[contains(@href, '/all')]").click()
                sleep(10)
                driver.find_element(By.XPATH, Locator.profile_dropdown_hotdrops).click()
                sleep(5)
                driver.find_element(By.XPATH, "//li[contains(.,'Profile settings')]").click()
                time.sleep(5)
                driver.switch_to.window(driver.window_handles[-1])
                time.sleep(5)
                #driver.find_element("xpath", '//*[@class="profile-input-edit btn"]').click()
                #driver.find_element("xpath", '//*[@class="profile-input-edit btn hotdrops-bg"]').click()
                time.sleep(10)
                webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()

                # Saving the Screenshot
                driver.save_screenshot(SCREENSHOT_DIRECTORY + "Contract_ConfirmReject.png")
                time.sleep(10)

                # driver.find_element_by_xpath('//button[text()="OK"]').click()
                # print("driver.window_handles_final : " + str(self.driver.window_handles))
                # time.sleep(5)
                # driver.switch_to.window(driver.window_handles[-1])
                assert Test_HealthCheck.SUT + Locator.public_key == self.driver.current_url
                #assert (NEW_DEV_URL) in self.driver.current_url


            except AssertionError:
                pytest.fail("Test case failed")
            except NoSuchElementException:
                pytest.fail("Test case failed")
            except NoSuchWindowException:
                pytest.fail("Test case failed")
            except ElementNotInteractableException:
                pytest.fail("Test case failed")
            except ElementClickInterceptedException:
                pytest.fail("Test case failed")
            except:
                print(traceback.format_exc())

        @pytest.mark.skip
        def test_Upload_Metadata_csv(self):
            try:

                _t = None
                print("Running the Test Open Url")
                if _data['MITM'] == 'True':
                    print("Clearing Cache as flag is True")
                    c.clearCache()
                time.sleep(2)
                ######################### Using Proxy Service ##########################################

                driver = self.driver
                time.sleep(10)

                # driver.find_element_by_xpath("//a[contains(@href, '/all')]").click()
                # sleep(10)
                # driver.find_element_by_xpath("//div[@id='root']/div/div/div/div[3]/div/div[2]/div/div/button[2]").click()
                driver.find_element(By.XPATH, Locator.profile_dropdown).click()
                # driver.find_element_by_xpath("//span[contains(.,'@suresh111')]").click()
                sleep(5)
                driver.find_element(By.XPATH, "//li[contains(.,'Factory')]").click()
                time.sleep(2)
                webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()

                Contract_list_tab = driver.find_element(By.XPATH, '//a[contains(text(),"My Contracts")]')
                driver.execute_script("arguments[0].scrollIntoView();", Contract_list_tab)
                driver.execute_script("arguments[0].click();", Contract_list_tab)
                # driver.find_element(By.XPATH,'//a[contains(text(),"My Contracts")]').click()
                time.sleep(15)
                driver.find_element(By.XPATH, '//body').send_keys(Keys.CONTROL + Keys.HOME)
                time.sleep(5)
                search_contract_box = driver.find_element("xpath", "//input[@placeholder='Search Contracts']")
                driver.find_element("xpath", "//input[@placeholder='Search Contracts']").send_keys(Keys.RETURN)
                time.sleep(5)
                driver.find_element("xpath", "//input[@placeholder='Search Contracts']").send_keys("270420")
                time.sleep(10)
                webdriver.ActionChains(driver).send_keys(Keys.TAB).perform()
                time.sleep(2)
                webdriver.ActionChains(driver).send_keys(Keys.ENTER).perform()
                # driver.find_element("xpath", "//div[1]/div/div/div[1]/div[2]/div/div/div/div[1]/div/p").click()
                time.sleep(10)
                driver.find_element(By.XPATH, '//a[contains(text(),"Existing Collections")]').click()
                time.sleep(5)
                driver.find_element(By.XPATH, '//div[1]/div/div/div[3]/div[2]/div/div[1]/div[2]/div[2]/div/a').click()
                time.sleep(5)
                driver.find_element(By.XPATH, '//*[@id="Batch Metadata"]').click()
                time.sleep(5)
                driver.find_element("xpath", "//button[contains(.,'Advanced')]").click()

                # Upload csv
                inputs_csv = driver.find_elements("xpath", "//input[@type='file']")
                time.sleep(5)
                upload_csv_element = driver.find_element("xpath", "//div[@id='App']/div/div[3]/div[2]/div[5]/section/div/img")
                driver.execute_script("arguments[0].scrollIntoView();", upload_csv_element)
                #driver.execute_script("arguments[0].send_keys(METADATA_CSV_FILE);", upload_csv_element)
                #driver.find_element("xpath", "//input[@type='file']").send_keys(METADATA_CSV_FILE)
                time.sleep(5)
                #print(inputs_csv)
                inputs_csv[1].send_keys(METADATA_CSV_FILE)
                #driver.find_element("xpath", "//div[@id='App']/div/div[3]/div[2]/div[5]/section/div/img").send_keys(METADATA_CSV_FILE)
                time.sleep(30)
                #driver.find_element("xpath", "//button[contains(.,'Advanced')]").click()
                time.sleep(10)
                driver.execute_script("window.scrollTo(0,document.body.scrollHeight)")
                print("driver.window_handles : " + str(self.driver.window_handles))
                time.sleep(5)

                assert (NEW_DEV_URL + "creator/contract") in self.driver.current_url


            except AssertionError:
                pytest.fail("Test case failed")
            except NoSuchElementException:
                pytest.fail("Test case failed")
            except ElementNotInteractableException:
                pytest.fail("Test case failed")
            except ElementClickInterceptedException:
                pytest.fail("Test case failed")
            except NoSuchWindowException:
                pytest.fail("Test case failed")
            except IndexError:
                pytest.fail("Test case failed")
            except:
                print(traceback.format_exc())


        @pytest.mark.skip
        def test_Upload_Video_Factory(self):
            try:

                _t = None
                print("Running the Test Open Url")
                if _data['MITM'] == 'True':
                    print("Clearing Cache as flag is True")
                    c.clearCache()
                time.sleep(2)
                ######################### Using Proxy Service ##########################################

                driver = self.driver
                time.sleep(10)

                # driver.find_element_by_xpath("//a[contains(@href, '/all')]").click()
                #sleep(10)
                # driver.find_element_by_xpath("//div[@id='root']/div/div/div/div[3]/div/div[2]/div/div/button[2]").click()
                #driver.find_element(By.XPATH, Locator.profile_dropdown_hotdrops).click()
                try:
                    driver.find_element(By.XPATH, Locator.profile_dropdown_hotdrops).click()
                except:
                    print("### Exception ###")
                    driver.find_element(By.XPATH, Locator.profile_dropdown).click()
                else:
                    print("Nothing went wrong")
                # driver.find_element_by_xpath("//span[contains(.,'@suresh111')]").click()
                sleep(5)
                driver.find_element(By.XPATH, "//li[contains(.,'Factory')]").click()
                time.sleep(2)
                webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()

                Contract_list_tab = driver.find_element(By.XPATH, '//a[contains(text(),"My Contracts")]')
                driver.execute_script("arguments[0].scrollIntoView();", Contract_list_tab)
                driver.execute_script("arguments[0].click();", Contract_list_tab)
                #driver.find_element(By.XPATH,'//a[contains(text(),"My Contracts")]').click()
                time.sleep(15)
                driver.find_element(By.XPATH, '//body').send_keys(Keys.CONTROL + Keys.HOME)
                time.sleep(5)
                search_contract_box = driver.find_element("xpath", "//input[@placeholder='Contract filter']")
                driver.find_element("xpath", "//input[@placeholder='Contract filter']").send_keys(Keys.RETURN)
                time.sleep(5)
                driver.find_element("xpath", "//input[@placeholder='Contract filter']").send_keys(Test_HealthCheck.SEARCH_CONTRACT)
                time.sleep(10)
                webdriver.ActionChains(driver).send_keys(Keys.TAB, Keys.TAB, Keys.TAB, Keys.TAB, Keys.TAB, Keys.TAB, Keys.TAB, Keys.TAB, Keys.TAB).perform()
                time.sleep(2)
                webdriver.ActionChains(driver).send_keys(Keys.ENTER).perform()
                #driver.find_element("xpath", "//div[1]/div/div/div[1]/div[2]/div/div/div/div[1]/div/p").click()
                time.sleep(10)
                driver.find_element(By.XPATH,'//a[contains(text(),"Existing Collections")]').click()
                time.sleep(5)
                driver.find_element(By.XPATH,'//div[1]/div/div/div[3]/div[2]/div/div[1]/div[2]/div[2]/div/a').click()
                time.sleep(8)
                driver.find_element(By.XPATH,'//*[@id="Media Files"]').click()

                # Upload video
                time.sleep(5)
                driver.find_element("xpath", "//input[@type='file']").send_keys(VIDEO_UPLOAD_FILE)
                time.sleep(10)
                driver.execute_script("window.scrollTo(0,document.body.scrollHeight)")
                print("driver.window_handles : " + str(self.driver.window_handles))
                time.sleep(5)
                select_contract = driver.find_element("xpath", "//button[contains(.,'Select offer')]")
                #select_contract = driver.find_element("xpath", '//*[@class="form-control input-select-custom-style"]')
                driver.execute_script("arguments[0].scrollIntoView();", select_contract)
                driver.execute_script("arguments[0].click();", select_contract)
                #driver.find_element("xpath", "//*[contains(.,'Select a Contract')]").click()
                #driver.find_element("xpath", "//div[1]/div/div/div[3]/div[2]/div[2]/div[2]/div/div[2]/div/div").click()
                time.sleep(15)
                webdriver.ActionChains(driver).send_keys(Keys.TAB).perform()
                time.sleep(5)
                webdriver.ActionChains(driver).send_keys(Keys.TAB).perform()
                time.sleep(5)
                webdriver.ActionChains(driver).send_keys(Keys.ARROW_RIGHT).perform()
                time.sleep(2)
                webdriver.ActionChains(driver).send_keys(Keys.TAB).perform()
                time.sleep(5)
                webdriver.ActionChains(driver).send_keys(Keys.ARROW_RIGHT).perform()
                time.sleep(5)
                driver.find_element("xpath", "//button[contains(.,'Save')]").click()
                time.sleep(5)
                #driver.find_element("xpath", "//div[1]/div/div/div[3]/div[2]/div[2]/div[2]/div/div[1]/div[1]/span/button/i").click()
                #webdriver.ActionChains(driver).send_keys(Keys.TAB).perform()
                #webdriver.ActionChains(driver).send_keys(Keys.TAB).perform()
                #driver.find_element("xpath", "//input[2]").send_keys("Automation")
                #webdriver.ActionChains(driver).send_keys(Keys.TAB).perform()
                #time.sleep(2)
                #webdriver.ActionChains(driver).send_keys(Keys.ARROW_RIGHT).perform()
                #time.sleep(2)
                #driver.find_element("xpath", "//button[contains(.,'Update')]").click()
                driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(5)
                driver.find_element("xpath", "//button[contains(.,'Upload')]").click()
                time.sleep(5)
                driver.switch_to.window(driver.window_handles[-1])
                time.sleep(5)
                driver.find_element("xpath", "//button[contains(.,'Cloud')]").click()
                time.sleep(80)

                # Saving the Screenshot
                driver.save_screenshot(SCREENSHOT_DIRECTORY + "Contract_ConfirmReject.png")
                time.sleep(10)

                # Opening the image & storing it in an image object
                img = Image.open(SCREENSHOT_DIRECTORY + "Contract_ConfirmReject.png")
                time.sleep(5)

                # Size of the image in pixels (size of original image)
                # (This is not mandatory)
                width, height = img.size

                # Setting the points for cropped image
                left = 400
                top = height / 8
                right = 1200
                bottom = 7 * height / 8

                # Cropped image of above dimension
                # (It will not change original image)
                im1 = img.crop((left, top, right, bottom))
                # Shows the image in image viewer
                # im1.show()

                # Passing the image object to image_to_string() function
                # This function will extract the text from the image
                text = pytesseract.image_to_string(im1)

                # Modifying text
                mod_text = text.rstrip()
                without_line_breaks = mod_text.replace("\n", " ")

                # Appending text to log file
                test_logs = open(SCREENSHOT_DIRECTORY + "TestExecutionLogs.txt", "a")
                test_case_name = os.environ.get('PYTEST_CURRENT_TEST').split(':')[-1].split(' ')[0]
                test_logs.write(
                    Test_HealthCheck.dt_string + "," + test_case_name + "," + without_line_breaks + "\n")
                test_logs.close()
                # print(text[:-1])
                time.sleep(5)

                # driver.find_element_by_xpath('//button[text()="OK"]').click()
                # print("driver.window_handles_final : " + str(self.driver.window_handles))
                # time.sleep(5)
                # driver.switch_to.window(driver.window_handles[-1])
                # assert CREATOR_URL == self.driver.current_url
                assert (Test_HealthCheck.SUT + "creator/contract") in self.driver.current_url


            except AssertionError:
                pytest.fail("Test case failed")
            except NoSuchElementException:
                pytest.fail("Test case failed")
            except ElementNotInteractableException:
                pytest.fail("Test case failed")
            except ElementClickInterceptedException:
                pytest.fail("Test case failed")
            except NoSuchWindowException:
                pytest.fail("Test case failed")
            except IndexError:
                pytest.fail("Test case failed")
            except:
                print(traceback.format_exc())

        @pytest.mark.skip
        def test_Delete_Video_Factory(self):
                    try:

                        _t = None
                        print("Running the Test Open Url")
                        if _data['MITM'] == 'True':
                            print("Clearing Cache as flag is True")
                            c.clearCache()
                        time.sleep(2)
                        ######################### Using Proxy Service ##########################################

                        driver = self.driver
                        time.sleep(10)

                        #Deletig video
                        trash_icon = driver.find_element("xpath", '//*[@class="fas fa-trash"]')
                        time.sleep(2)
                        driver.execute_script("arguments[0].scrollIntoView();", trash_icon)
                        driver.execute_script("arguments[0].click();", trash_icon)

                        #driver.find_element(By.XPATH, "//div[@id='App']/div/div[3]/div[2]/div[2]/div[2]/div/button[2]/i").click()
                        #driver.find_element("xpath", '//*[@class="btn btn-danger rounded-rairo"]').click()
                        time.sleep(5)
                        driver.switch_to.window(driver.window_handles[1])
                        driver.find_element("xpath", "//button[contains(.,'Yes')]").click()
                        #driver.find_element(By.XPATH, "//div[5]/div/div[6]/button[1]").click()
                        time.sleep(5)
                        webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()
                        time.sleep(5)
                        driver.switch_to.window(driver.window_handles[-1])
                        time.sleep(5)

                        assert (Test_HealthCheck.SUT + "creator/contract") in self.driver.current_url

                    except AssertionError:
                        pytest.fail("Test case failed")
                    except NoSuchElementException:
                        pytest.fail("Test case failed")
                    except ElementNotInteractableException:
                        pytest.fail("Test case failed")
                    except IndexError:
                        pytest.fail("Test case failed")
                    except NoSuchWindowException:
                        pytest.fail("Test case failed")
                    except:
                        print(traceback.format_exc())


        @pytest.mark.skip
        def test_Upload_DemoVideo_Factory(self):
            try:

                _t = None
                print("Running the Test Open Url")
                if _data['MITM'] == 'True':
                    print("Clearing Cache as flag is True")
                    c.clearCache()
                time.sleep(2)
                ######################### Using Proxy Service ##########################################

                driver = self.driver
                time.sleep(10)

                # driver.find_element_by_xpath("//a[contains(@href, '/all')]").click()
                #sleep(10)
                # driver.find_element_by_xpath("//div[@id='root']/div/div/div/div[3]/div/div[2]/div/div/button[2]").click()
                #driver.find_element(By.XPATH, Locator.profile_dropdown_hotdrops).click()
                try:
                    driver.find_element(By.XPATH, Locator.profile_dropdown_hotdrops).click()
                except:
                    print("### Exception ###")
                    driver.find_element(By.XPATH, Locator.profile_dropdown).click()
                else:
                    print("Nothing went wrong")
                # driver.find_element_by_xpath("//span[contains(.,'@suresh111')]").click()
                sleep(5)
                driver.find_element(By.XPATH, "//li[contains(.,'Factory')]").click()
                time.sleep(2)
                webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()

                Contract_list_tab = driver.find_element(By.XPATH, '//a[contains(text(),"My Contracts")]')
                driver.execute_script("arguments[0].scrollIntoView();", Contract_list_tab)
                driver.execute_script("arguments[0].click();", Contract_list_tab)
                #driver.find_element(By.XPATH,'//a[contains(text(),"My Contracts")]').click()
                time.sleep(15)
                driver.find_element(By.XPATH, '//body').send_keys(Keys.CONTROL + Keys.HOME)
                time.sleep(5)
                search_contract_box = driver.find_element("xpath", "//input[@placeholder='Contract filter']")
                driver.find_element("xpath", "//input[@placeholder='Contract filter']").send_keys(Keys.RETURN)
                time.sleep(5)
                driver.find_element("xpath", "//input[@placeholder='Contract filter']").send_keys(Test_HealthCheck.SEARCH_CONTRACT)
                time.sleep(10)
                webdriver.ActionChains(driver).send_keys(Keys.TAB, Keys.TAB, Keys.TAB, Keys.TAB, Keys.TAB, Keys.TAB, Keys.TAB, Keys.TAB, Keys.TAB).perform()
                time.sleep(2)
                webdriver.ActionChains(driver).send_keys(Keys.ENTER).perform()
                #driver.find_element("xpath", "//div[1]/div/div/div[1]/div[2]/div/div/div/div[1]/div/p").click()
                time.sleep(10)
                driver.find_element(By.XPATH,'//a[contains(text(),"Existing Collections")]').click()
                time.sleep(5)
                driver.find_element(By.XPATH,'//div[1]/div/div/div[3]/div[2]/div/div[1]/div[2]/div[2]/div/a').click()
                time.sleep(8)
                driver.find_element(By.XPATH,'//*[@id="Media Files"]').click()

                # Upload video
                time.sleep(5)
                driver.find_element("xpath", "//input[@type='file']").send_keys(VIDEO_UPLOAD_FILE)
                time.sleep(10)
                driver.execute_script("window.scrollTo(0,document.body.scrollHeight)")
                print("driver.window_handles : " + str(self.driver.window_handles))
                time.sleep(5)
                select_contract = driver.find_element("xpath", "//button[contains(.,'Select offer')]")
                #select_contract = driver.find_element("xpath", '//*[@class="form-control input-select-custom-style"]')
                driver.execute_script("arguments[0].scrollIntoView();", select_contract)
                driver.execute_script("arguments[0].click();", select_contract)
                #driver.find_element("xpath", "//*[contains(.,'Select a Contract')]").click()
                #driver.find_element("xpath", "//div[1]/div/div/div[3]/div[2]/div[2]/div[2]/div/div[2]/div/div").click()
                time.sleep(15)
                webdriver.ActionChains(driver).send_keys(Keys.TAB).perform()
                time.sleep(5)
                webdriver.ActionChains(driver).send_keys(Keys.TAB).perform()
                time.sleep(5)
                webdriver.ActionChains(driver).send_keys(Keys.ARROW_RIGHT).perform()
                time.sleep(5)
                webdriver.ActionChains(driver).send_keys(Keys.TAB).perform()
                time.sleep(5)
                webdriver.ActionChains(driver).send_keys(Keys.ARROW_RIGHT).perform()
                time.sleep(5)
                driver.find_element("xpath", "//button[contains(.,'Unlockable')]").click()
                time.sleep(5)
                driver.find_element("xpath", "//button[contains(.,'Save')]").click()
                time.sleep(5)
                #driver.find_element("xpath", "//div[1]/div/div/div[3]/div[2]/div[2]/div[2]/div/div[1]/div[1]/span/button/i").click()
                #webdriver.ActionChains(driver).send_keys(Keys.TAB).perform()
                #webdriver.ActionChains(driver).send_keys(Keys.TAB).perform()
                #driver.find_element("xpath", "//input[2]").send_keys("Automation")
                #webdriver.ActionChains(driver).send_keys(Keys.TAB).perform()
                #time.sleep(2)
                #webdriver.ActionChains(driver).send_keys(Keys.ARROW_RIGHT).perform()
                #time.sleep(2)
                #driver.find_element("xpath", "//button[contains(.,'Update')]").click()
                driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(5)
                driver.find_element("xpath", "//button[contains(.,'Upload')]").click()
                time.sleep(5)
                driver.switch_to.window(driver.window_handles[-1])
                time.sleep(5)
                driver.find_element("xpath", "//button[contains(.,'Cloud')]").click()
                time.sleep(80)

                # Saving the Screenshot
                driver.save_screenshot(SCREENSHOT_DIRECTORY + "Contract_ConfirmReject.png")
                time.sleep(10)

                # Opening the image & storing it in an image object
                img = Image.open(SCREENSHOT_DIRECTORY + "Contract_ConfirmReject.png")
                time.sleep(5)

                # Size of the image in pixels (size of original image)
                # (This is not mandatory)
                width, height = img.size

                # Setting the points for cropped image
                left = 400
                top = height / 8
                right = 1200
                bottom = 7 * height / 8

                # Cropped image of above dimension
                # (It will not change original image)
                im1 = img.crop((left, top, right, bottom))
                # Shows the image in image viewer
                # im1.show()

                # Passing the image object to image_to_string() function
                # This function will extract the text from the image
                text = pytesseract.image_to_string(im1)

                # Modifying text
                mod_text = text.rstrip()
                without_line_breaks = mod_text.replace("\n", " ")

                # Appending text to log file
                test_logs = open(SCREENSHOT_DIRECTORY + "TestExecutionLogs.txt", "a")
                test_case_name = os.environ.get('PYTEST_CURRENT_TEST').split(':')[-1].split(' ')[0]
                test_logs.write(
                    Test_HealthCheck.dt_string + "," + test_case_name + "," + without_line_breaks + "\n")
                test_logs.close()
                # print(text[:-1])
                time.sleep(5)

                # driver.find_element_by_xpath('//button[text()="OK"]').click()
                # print("driver.window_handles_final : " + str(self.driver.window_handles))
                # time.sleep(5)
                # driver.switch_to.window(driver.window_handles[-1])
                # assert CREATOR_URL == self.driver.current_url
                assert (Test_HealthCheck.SUT + "creator/contract") in self.driver.current_url


            except AssertionError:
                pytest.fail("Test case failed")
            except NoSuchElementException:
                pytest.fail("Test case failed")
            except ElementNotInteractableException:
                pytest.fail("Test case failed")
            except ElementClickInterceptedException:
                pytest.fail("Test case failed")
            except NoSuchWindowException:
                pytest.fail("Test case failed")
            except IndexError:
                pytest.fail("Test case failed")
            except:
                print(traceback.format_exc())

        @pytest.mark.skip
        def test_Delete_DemoVideo_Factory(self):
                    try:

                        _t = None
                        print("Running the Test Open Url")
                        if _data['MITM'] == 'True':
                            print("Clearing Cache as flag is True")
                            c.clearCache()
                        time.sleep(2)
                        ######################### Using Proxy Service ##########################################

                        driver = self.driver
                        time.sleep(10)

                        #Deletig video
                        trash_icon = driver.find_element("xpath", '//*[@class="fas fa-trash"]')
                        time.sleep(2)
                        driver.execute_script("arguments[0].scrollIntoView();", trash_icon)
                        driver.execute_script("arguments[0].click();", trash_icon)

                        #driver.find_element(By.XPATH, "//div[@id='App']/div/div[3]/div[2]/div[2]/div[2]/div/button[2]/i").click()
                        #driver.find_element("xpath", '//*[@class="btn btn-danger rounded-rairo"]').click()
                        time.sleep(5)
                        driver.switch_to.window(driver.window_handles[1])
                        driver.find_element("xpath", "//button[contains(.,'Yes')]").click()
                        #driver.find_element(By.XPATH, "//div[5]/div/div[6]/button[1]").click()
                        time.sleep(5)
                        webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()
                        time.sleep(5)
                        driver.switch_to.window(driver.window_handles[-1])
                        time.sleep(5)

                        assert (Test_HealthCheck.SUT + "creator/contract") in self.driver.current_url


                    except AssertionError:
                        pytest.fail("Test case failed")
                    except NoSuchElementException:
                        pytest.fail("Test case failed")
                    except ElementNotInteractableException:
                        pytest.fail("Test case failed")
                    except IndexError:
                        pytest.fail("Test case failed")
                    except NoSuchWindowException:
                        pytest.fail("Test case failed")
                    except:
                        print(traceback.format_exc())


        #@pytest.mark.skip
        def test_Logout_metamask_OpenCarbon(self):
            try:

                        _t = None
                        print("Running the Test Open Url")
                        if _data['MITM'] == 'True':
                            print("Clearing Cache as flag is True")
                            c.clearCache()
                        time.sleep(2)
                        ######################### Using Proxy Service ##########################################

                        driver = self.driver
                        Logout_hotdrops(self)
                        #driver.delete_all_cookies()
                        #delete_cookies(self)

                        # assert CREATOR_URL == self.driver.current_url
                        #assert (NEW_DEV_URL) in self.driver.current_url


            except AssertionError:
                pytest.fail("Test case failed")
            except NoSuchElementException:
                pytest.fail("Test case failed")
            except NoAlertPresentException:
                pytest.fail("Test case failed")
            except ElementNotInteractableException:
                pytest.fail("Test case failed")
            except ElementClickInterceptedException:
                pytest.fail("Test case failed")
            except NoSuchWindowException:
                pytest.fail("Test case failed")
            except:
                print(traceback.format_exc())

        #@pytest.mark.skip
        def test_connectWallet_metamask_rairprotocol(self):
            try:

                _t = None
                print("Running the Test Open Url")
                if _data['MITM'] == 'True':
                    print("Clearing Cache as flag is True")
                    c.clearCache()
                time.sleep(2)
                ######################### Using Proxy Service ##########################################

                driver = self.driver

                #####################

                ConnectWallet_metamask(self, RAIRPROTOCOL)

            except AssertionError:
                pytest.fail("Test case failed")
            except NoSuchElementException:
                pytest.fail("Test case failed")
            except WebDriverException:
                pytest.fail("Test case failed")
            except IndexError:
                pytest.fail("Test case failed")
            except NoSuchWindowException:
                pytest.fail("Test case failed")
            except:
                print(traceback.format_exc())

        #@pytest.mark.skip
        def test_Logout_metamask_rairprotocol(self):
            try:

                        _t = None
                        print("Running the Test Open Url")
                        if _data['MITM'] == 'True':
                            print("Clearing Cache as flag is True")
                            c.clearCache()
                        time.sleep(2)
                        ######################### Using Proxy Service ##########################################

                        Logout_hotdrops(self)
                        #delete_cookies(self)

                        # assert CREATOR_URL == self.driver.current_url
                        #assert (HOTDROPS_PROD_URL) in self.driver.current_url


            except AssertionError:
                pytest.fail("Test case failed")
            except NoSuchElementException:
                pytest.fail("Test case failed")
            except ElementNotInteractableException:
                pytest.fail("Test case failed")
            except NoSuchWindowException:
                pytest.fail("Test case failed")
            except:
                print(traceback.format_exc())

        @pytest.mark.skip
        def test_connectWallet_metamask_rairlicense(self):
            try:

                        _t = None
                        print("Running the Test Open Url")
                        if _data['MITM'] == 'True':
                            print("Clearing Cache as flag is True")
                            c.clearCache()
                        time.sleep(2)
                        ######################### Using Proxy Service ##########################################

                        driver = self.driver

                        #####################

                        ConnectWallet_metamask(self, RAIRLICENSE)

            except AssertionError:
                pytest.fail("Test case failed")
            except NoSuchElementException:
                pytest.fail("Test case failed")
            except IndexError:
                pytest.fail("Test case failed")
            except NoSuchWindowException:
                pytest.fail("Test case failed")
            except WebDriverException:
                pytest.fail("Test case failed")
            except:
                print(traceback.format_exc())

        @pytest.mark.skip
        def test_Logout_metamask_rairlicense(self):
            try:

                        _t = None
                        print("Running the Test Open Url")
                        if _data['MITM'] == 'True':
                            print("Clearing Cache as flag is True")
                            c.clearCache()
                        time.sleep(2)
                        ######################### Using Proxy Service ##########################################
                        driver = self.driver
                        Logout(self)
                        #delete_cookies(self)

                        # assert CREATOR_URL == self.driver.current_url
                        #assert (BETA_URL) in self.driver.current_url


            except AssertionError:
                pytest.fail("Test case failed")
            except NoSuchElementException:
                pytest.fail("Test case failed")
            except ElementNotInteractableException:
                pytest.fail("Test case failed")
            except NoSuchWindowException:
                pytest.fail("Test case failed")
            except:
                print(traceback.format_exc())


        @pytest.mark.skip
        def test_metamask_switchAccount(self):
            try:

                _t = None
                print("Running the Test Open Url")
                if _data['MITM'] == 'True':
                    print("Clearing Cache as flag is True")
                    c.clearCache()
                time.sleep(2)
                ######################### Using Proxy Service ##########################################

                driver = self.driver
                print(Test_HealthCheck.addon_id)
                #uninstall metamask
                self.driver.uninstall_addon(Test_HealthCheck.addon_id)
                time.sleep(5)
                self.driver.switch_to.window(window_name=self.driver.window_handles[-1])
                time.sleep(30)
                driver.close()
                self.driver.install_addon(EXTENSION_PATH_FIREFOX, temporary=True)
                time.sleep(2)
                self.driver.switch_to.window(window_name=self.driver.window_handles[-1])
                time.sleep(5)

                metamask_user_login(self, SECRET_RECOVERY_PHRASE_QA, NEW_PASSWORD_QA)
                time.sleep(5)


            except AssertionError:
                pytest.fail("Test case failed")
            except NoSuchElementException:
                pytest.fail("Test case failed")
            except IndexError:
                pytest.fail("Test case failed")
            except NoSuchWindowException:
                pytest.fail("Test case failed")
            except:
                print(traceback.format_exc())

        @pytest.mark.skip
        def test_connectWallet_metamask_account2_newdev(self):
            try:

                _t = None
                print("Running the Test Open Url")
                if _data['MITM'] == 'True':
                    print("Clearing Cache as flag is True")
                    c.clearCache()
                time.sleep(2)
                ###

                driver = self.driver

                #####################
                ConnectWallet_metamask(self,Test_HealthCheck.SUT)

            except AssertionError:
                pytest.fail("Test case failed")
            except NoSuchElementException:
                pytest.fail("Test case failed")
            except IndexError:
                pytest.fail("Test case failed")
            except NoSuchWindowException:
                pytest.fail("Test case failed")
            except:
                print(traceback.format_exc())

        @pytest.mark.skip
        def test_MintResaleToken_SingleTokenView(self):
                    try:

                        _t = None
                        print("Running the Test Open Url")
                        if _data['MITM'] == 'True':
                            print("Clearing Cache as flag is True")
                            c.clearCache()
                        time.sleep(2)
                        ######################### Using Proxy Service ##########################################


                        driver = self.driver
                        #Test_HealthCheck.redirected_url= "http://35.225.69.217:8088/tokens/0x13881/0x51d945384e12390d94a051f0395944fda4ffe714/0/103"
                        #time.sleep(10)
                        self.driver.get(Test_HealthCheck.redirected_url)
                        time.sleep(10)
                        switch_network_button = driver.find_element("xpath", "//*[@id='nft-data-page-wrapper']/div[3]/div[3]/div[2]/div[2]/button")
                        driver.execute_script("arguments[0].scrollIntoView();", switch_network_button)
                        driver.execute_script("arguments[0].click();", switch_network_button)
                        time.sleep(10)
                        # Switch network
                        driver.switch_to.window(driver.window_handles[-1])
                        time.sleep(15)
                        driver.find_element("xpath", "//button[contains(.,'Approve')]").click()
                        time.sleep(10)
                        print("driver.window_handles_network : " + str(self.driver.window_handles))
                        driver.switch_to.window(driver.window_handles[-1])
                        time.sleep(10)
                        driver.find_element("xpath", "//button[contains(.,'Switch network')]").click()
                        time.sleep(10)
                        driver.switch_to.window(driver.window_handles[-1])
                        time.sleep(10)
                        buy_resale_button = driver.find_element("xpath", "//*[@id='nft-data-page-wrapper']/div[3]/div[3]/div[2]/div[2]/button")
                        driver.execute_script("arguments[0].scrollIntoView();", buy_resale_button)
                        driver.execute_script("arguments[0].click();", buy_resale_button)
                        time.sleep(5)
                        driver.switch_to.window(driver.window_handles[-1])
                        driver.find_element("xpath", "//button[contains(.,'OK')]").click()
                        time.sleep(20)

                        driver.switch_to.window(driver.window_handles[-1])
                        print("driver.window_handles_before_minted_1 : " + str(self.driver.window_handles))
                        token_confirm = driver.find_element("xpath", "//button[contains(.,'Reject')]")
                        driver.execute_script("arguments[0].scrollIntoView();", token_confirm)
                        time.sleep(10)
                        token_confirm_enabled = WebDriverWait(driver, 20).until(
                            EC.element_to_be_clickable((By.XPATH, "//button[contains(.,'Confirm')]")))
                        driver.execute_script("arguments[0].click();", token_confirm_enabled)
                        time.sleep(100)
                        print("driver.window_handles_token_minted : " + str(self.driver.window_handles))
                        driver.switch_to.window(driver.window_handles[-1])
                        time.sleep(5)

                        mint_status = driver.find_element("xpath", '//*[@id="swal2-title"]').text
                        print(mint_status)

                        #mint_message = driver.find_element("xpath", '//*[@id="swal2-html-container"]').text
                        #print(mint_message)
                        time.sleep(2)

                        driver.find_element("xpath", '//button[text()="OK"]').click()
                        print("driver.window_handles_updated_final : " + str(self.driver.window_handles))
                        time.sleep(5)
                        driver.switch_to.window(driver.window_handles[-1])
                        time.sleep(5)

                        assert mint_status == "Success"


                    except AssertionError:
                        pytest.fail("Test case failed")
                    except NoSuchElementException:
                        pytest.fail("Test case failed")
                    except NoSuchWindowException:
                        pytest.fail("Test case failed")
                    except ElementNotInteractableException:
                        pytest.fail("Test case failed")
                    except ElementClickInterceptedException:
                        pytest.fail("Test case failed")
                    except IndexError:
                        pytest.fail("Test case failed")
                    except:
                        print(traceback.format_exc())


        @pytest.mark.skip
        def test_Logout_account2(self):
            try:

                        _t = None
                        print("Running the Test Open Url")
                        if _data['MITM'] == 'True':
                            print("Clearing Cache as flag is True")
                            c.clearCache()
                        time.sleep(2)
                        ######################### Using Proxy Service ##########################################

                        driver = self.driver
                        Logout_hotdrops(self)
                        delete_cookies(self)

                        driver.delete_all_cookies()
                        #assert (NEW_DEV_URL) in self.driver.current_url


            except AssertionError:
                pytest.fail("Test case failed")
            except NoSuchElementException:
                pytest.fail("Test case failed")
            except ElementNotInteractableException:
                pytest.fail("Test case failed")
            except NoSuchWindowException:
                pytest.fail("Test case failed")
            except:
                print(traceback.format_exc())

        @pytest.mark.skip
        def test_ConnectWallet_Google_Hotdrops(self):
            try:

                _t = None
                print("Running the Test Open Url")
                if _data['MITM'] == 'True':
                    print("Clearing Cache as flag is True")
                    c.clearCache()
                time.sleep(2)
                ######################### Using Proxy Service ##########################################

                self.driver.get(HOTDROPS_PROD_URL)
                self.driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.CONTROL + "R")
                print(self.driver.title)
                driver = self.driver
                driver.implicitly_wait(50)
                driver.find_element("xpath", Locator.connect_wallet).click()
                time.sleep(10)
                driver.switch_to.window(driver.window_handles[-1])
                driver.find_element("xpath", "//button[contains(.,'Google')]").click()
                time.sleep(5)
                driver.switch_to.window(driver.window_handles[-1])
                print("driver.window_handles : " + str(self.driver.window_handles))
                time.sleep(15)
                driver.find_element("xpath", '//*[@id="identifierId"]').send_keys("jesiccanababan@gmail.com")
                time.sleep(5)
                driver.find_element("xpath", "//button[contains(.,'Next')]").click()
                time.sleep(30)
                driver.switch_to.window(driver.window_handles[-1])
                driver.find_element("xpath", '//*[@class="whsOnd zHQkBf"]').send_keys("OnPath321@")
                time.sleep(5)
                driver.find_element("xpath", "//button[contains(.,'Next')]").click()
                time.sleep(30)
                print("driver.window_handles_updated : " + str(self.driver.window_handles))
                driver.switch_to.window(driver.window_handles[-1])
                time.sleep(10)


            except AssertionError:
                pytest.fail("Test case failed")
            except NoSuchElementException:
                pytest.fail("Test case failed")
            except NoSuchWindowException:
                pytest.fail("Test case failed")
            except ElementNotInteractableException:
                pytest.fail("Test case failed")
            except IndexError:
                pytest.fail("Test case failed")
            except:
                print(traceback.format_exc())


        @pytest.mark.skip
        def test_connectWallet_metamask_RairTech(self):
            try:

                _t = None
                print("Running the Test Open Url")
                if _data['MITM'] == 'True':
                    print("Clearing Cache as flag is True")
                    c.clearCache()
                time.sleep(2)
                ######################### Using Proxy Service ##########################################

                self.driver.get(ABOUT_PAGE_URL)
                self.driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.CONTROL + "R")
                print(self.driver.title)
                driver = self.driver
                driver.implicitly_wait(50)
                driver.find_element("xpath", Locator.connect_wallet).click()
                time.sleep(10)
                driver.switch_to.window(driver.window_handles[-1])
                print("driver.window_handles : " + str(self.driver.window_handles))
                driver.find_element("xpath", "//button[contains(.,'Next')]").click()
                time.sleep(10)
                driver.find_element("xpath", "//button[contains(.,'Connect')]").click()
                time.sleep(20)
                print("driver.window_handles_updated : " + str(self.driver.window_handles))
                print("Metamask_window_handle : " + str(self.driver.window_handles[2]))
                time.sleep(10)
                driver.switch_to.window(driver.window_handles[-1])
                time.sleep(5)

                # Challenge Block
                # driver.find_element("xpath", "//div[1]/div/div[2]/div/div[3]/div[1]/i").click()
                driver.find_element("xpath", '//*[@class="fa fa-arrow-down"]').click()
                time.sleep(5)
                driver.find_element("xpath", "//button[contains(.,'Sign')]").click()
                time.sleep(15)
                print("driver.window_handles_updated : " + str(self.driver.window_handles))
                # driver.switch_to.window(driver.window_handles[2])
                time.sleep(5)
                driver.switch_to.window(driver.window_handles[-1])
                time.sleep(5)
                assert ABOUT_PAGE_URL + "/" == self.driver.current_url


            except AssertionError:
                pytest.fail("Test case failed")
            except NoSuchElementException:
                pytest.fail("Test case failed")
            except NoSuchWindowException:
                pytest.fail("Test case failed")
            except ElementNotInteractableException:
                pytest.fail("Test case failed")
            except IndexError:
                pytest.fail("Test case failed")
            except:
                print(traceback.format_exc())


        @pytest.mark.skip
        def test_StreamVideo_RairTech(self):
            try:

                _t = None
                print("Running the Test Open Url")
                if _data['MITM'] == 'True':
                    print("Clearing Cache as flag is True")
                    c.clearCache()
                time.sleep(2)
                ######################### Using Proxy Service ##########################################

                self.driver.get(ABOUT_PAGE_URL)
                self.driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.CONTROL + "R")
                print(self.driver.title)
                driver = self.driver
                driver.implicitly_wait(50)
                driver.find_element("xpath", Locator.connect_wallet).click()
                time.sleep(10)
                driver.switch_to.window(driver.window_handles[-1])
                print("driver.window_handles : " + str(self.driver.window_handles))
                driver.find_element("xpath", "//button[contains(.,'Next')]").click()
                time.sleep(10)
                driver.find_element("xpath", "//button[contains(.,'Connect')]").click()
                time.sleep(20)
                print("driver.window_handles_updated : " + str(self.driver.window_handles))
                print("Metamask_window_handle : " + str(self.driver.window_handles[2]))
                time.sleep(10)
                driver.switch_to.window(driver.window_handles[-1])
                time.sleep(5)

                # Challenge Block
                #driver.find_element("xpath", "//div[1]/div/div[2]/div/div[3]/div[1]/i").click()
                driver.find_element("xpath", '//*[@class="fa fa-arrow-down"]').click()
                time.sleep(5)
                driver.find_element("xpath", "//button[contains(.,'Sign')]").click()
                time.sleep(15)
                print("driver.window_handles_updated : " + str(self.driver.window_handles))
                # driver.switch_to.window(driver.window_handles[2])
                time.sleep(5)
                driver.switch_to.window(driver.window_handles[-1])

                #stream video

                SecondVideo = driver.find_element("xpath",
                                                 '//div[1]/div/div/div[3]/div[2]/div/div[20]/div/div/div[2]/div[2]/div/div[1]/div')
                driver.execute_script("arguments[0].scrollIntoView();", SecondVideo)
                driver.execute_script("arguments[0].click();", SecondVideo)
                time.sleep(10)
                # driver.find_element("xpath", "//div/div/div/div[3]/div[2]/div/div/div[4]/div[2]/div").click()
                # time.sleep(5)
                #driver.switch_to.window(driver.window_handles[-1])

                SecondVideo_popup = driver.find_element("xpath",
                                                       '//div[1]/div/div/div[3]/div[2]/div/div[20]/div/div/div[1]/img')
                driver.execute_script("arguments[0].scrollIntoView();", SecondVideo_popup)
                driver.execute_script("arguments[0].click();", SecondVideo_popup)
                # webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()
                # time.sleep(5)
                # driver.switch_to.window(driver.window_handles[-1])
                time.sleep(40)

                substring = "2.ts"
                # JavaScript command to traffic
                r = driver.execute_script("return window.performance.getEntries();")
                result = 0
                for res in r:
                    if result != 1:
                        # print(res['name'])
                        fullstring = res['name']
                        print("%%%%%%%%%%%%%")
                        print(fullstring)
                        if fullstring != None and substring in fullstring:
                            result = 1
                            assert result == 1
                            print("Found!")
                            # Appending text to log file
                            test_logs = open(SCREENSHOT_DIRECTORY + "TestExecutionLogs.txt", "w")
                            test_case_name = os.environ.get('PYTEST_CURRENT_TEST').split(':')[-1].split(' ')[0]
                            test_logs.write(
                                Test_HealthCheck.dt_string + "," + test_case_name + "," + "Test case Passed" + "," + fullstring + "\n")
                            test_logs.close()
                        else:
                            result = 0
                            print("Not found!")
                            # Appending text to log file
                            test_logs = open(SCREENSHOT_DIRECTORY + "TestExecutionLogs.txt", "w")
                            test_case_name = os.environ.get('PYTEST_CURRENT_TEST').split(':')[-1].split(' ')[0]
                            test_logs.write(
                                Test_HealthCheck.dt_string + "," + test_case_name + "," + "Test case Failed" + "," + fullstring + "\n")
                            test_logs.close()

                # assert GREYMAN_URL == self.driver.current_url

                webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()
                time.sleep(5)
                driver.switch_to.window(driver.window_handles[-1])
                time.sleep(5)
                assert result == 1


            except AssertionError:
                pytest.fail("Test case failed")
            except NoSuchElementException:
                pytest.fail("Test case failed")
            except NoSuchWindowException:
                pytest.fail("Test case failed")
            except ElementNotInteractableException:
                pytest.fail("Test case failed")
            except IndexError:
                pytest.fail("Test case failed")
            except:
                print(traceback.format_exc())

        @pytest.mark.skip
        def test_Logout_metamask_rairTech(self):
            try:

                        _t = None
                        print("Running the Test Open Url")
                        if _data['MITM'] == 'True':
                            print("Clearing Cache as flag is True")
                            c.clearCache()
                        time.sleep(2)
                        ######################### Using Proxy Service ##########################################

                        Logout(self)

                        # assert CREATOR_URL == self.driver.current_url
                        assert (ABOUT_PAGE_URL) in self.driver.current_url


            except AssertionError:
                pytest.fail("Test case failed")
            except NoSuchElementException:
                pytest.fail("Test case failed")
            except ElementNotInteractableException:
                pytest.fail("Test case failed")
            except NoSuchWindowException:
                pytest.fail("Test case failed")
            except:
                print(traceback.format_exc())

