# -*- coding: utf-8 -*-

# import libraries
import sched, time
s = sched.scheduler(time.time, time.sleep)
def do_something(sc):
    print "Doing stuff..."
    # do your stuff
    s.enter(60, 1, do_something, (sc,))

    import urllib2
    from bs4 import BeautifulSoup

    import csv
    from datetime import datetime

    # specify the url
    quote_page = [
    'https://www.jennyfer.com/fr-fr/vetements/pulls-et-gilets/pull-a-perles-gris-chine-10020642067.html',
    'https://www.jennyfer.com/fr-fr/vetements/pulls-et-gilets/pull-cotele-camel-10020749039.html',
    'https://www.jennyfer.com/fr-fr/vetements/pulls-et-gilets/pull-toucher-cachemire-ecru-10020137001.html']

    # loop
    data = []

    for pg in quote_page:
        # query the website and return html to the variable " page"
        page = urllib2.urlopen(pg)

        #parse the html using beautiful soap and store in variable "soup"
        soup = BeautifulSoup(page, 'html.parser')

        #Take out the <div> of name and get its value

        name_div =  soup.find('h1', attrs={'class': 'product-name'})
        name = name_div.text.strip() # strip() is used to remove starting and trailing
        print name
        #get the index price
        price_div =  soup.find('span', attrs={'itemprop': 'price'})
        price = price_div.text
        print price

        #save the date in tuple
        data.append((name,price))

    #open a csv file with append, so old data will not be erased
    with open('pull.csv', 'a') as csv_file:
        writer = csv.writer(csv_file)
        # loop for
        for name, price in data:
            writer.writerow([name.encode("utf-8"), price.encode("utf-8"), datetime.now()])



s.enter(1, 1, do_something, (s,))
s.run()
