#python manage.py shell < read.py

def readFile(path):
    import csv
    from search.models import Haikai, Author, Collection
    
    openFile = open(path, mode='r', encoding='utf_8_sig')
    reader = csv.reader(openFile)

    for line in reader:
        print(line)

        if len(line) > 9:
            parentCollection = Collection.objects.get_or_create(name=line[8])
            collection = Collection.objects.get_or_create(name=line[9], parent=parentCollection[0])

        else:
            collection = Collection.objects.get_or_create(name=line[8])
        
        try:
            if line[7]:
                author = Author.objects.get_or_create(name=line[7])
                haikai = Haikai.objects.get_or_create(number=line[0], firstPart=line[1], secondPart=line[2], lastPart=line[3], firstPartKana=line[4], secondPartKana=line[5], lastPartKana=line[6], author=author[0], collection=collection[0])

            else:
                haikai = Haikai.objects.get_or_create(number=line[0], firstPart=line[1], secondPart=line[2], lastPart=line[3], firstPartKana=line[4], secondPartKana=line[5], lastPartKana=line[6], collection=collection[0])

        except:
            continue
            
    return

readFile('data_haikai.csv')