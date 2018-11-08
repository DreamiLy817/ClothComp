
# -*- coding: utf-8 -*-

# import libraries
import sched, time
s = sched.scheduler(time.time, time.sleep)
def do_something(sc):
    print "Doing stuff..."
    # do your stuff
    s.enter(2, 1, do_something, (sc,))

    import urllib2
    from bs4 import BeautifulSoup

    import csv
    from datetime import datetime

    # specify the url
    quote_page = 'https://www.jennyfer.com/fr-fr/vetements/pulls-et-gilets/'

    # query the website and return the html to the variable page
    page = urllib2.urlopen(quote_page)

    # parse the html using beautiful soup and store in variable soup
    soup = BeautifulSoup(page, 'html.parser')

    # Take out the <div> of name and get its value
    name_box = soup.find('span', attrs={'class': 'price'})

    #After we have the tag, we can get the data by getting its text.
    name = name_box.text.strip() # strip() is used to remove starting and trailing
    print name

    # get the index price
    #price_box = soup.find('div', attrs={'class':'priceText__1853e8a5'})
    #price = price_box.text
    #print price


    # open a csv file with append, so old data will not be erased
    with open('index.csv', 'a') as csv_file:
     writer = csv.writer(csv_file)
     writer.writerow([name.encode("utf-8"), datetime.now()])


s.enter(1, 1, do_something, (s,))
s.run()
