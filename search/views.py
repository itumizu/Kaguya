import re
import logging
import time

from django.shortcuts import render, HttpResponse, redirect
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q

from .models import Haikai, Tanka

def index(request):
    return render(request, 'search/index.html', {})

@csrf_exempt
def search(request):
    query = ""
    searchTime = time.time()
    
    if not "q" in request.GET:
        return render(request, 'search/index.html', {})
    else:
        if "target" in request.GET:
            target = request.GET['target']
        else:
            target = ""

        if not request.GET['q']:
            searchTime = 0
            return render(request, 'search/result.html', {'target': target, 'query': "", 'time': searchTime, 'results': []})
        
        else:
            words = re.split(r"\s", re.sub(r"\s+", " ", request.GET['q']))

            # 俳諧
            if target == "haikai" or not target:
                queries = [Q(firstPart__contains=word) | Q(secondPart__contains=word) | Q(lastPart__contains=word) | Q(firstPartKana__contains=word) | Q(secondPartKana__contains=word) | Q(lastPartKana__contains=word) for word in words]
            
            #短歌
            elif target == "tanka":
                queries = [Q(firstPart__contains=word) | Q(secondPart__contains=word) | Q(thirdPart__contains=word) | Q(fourthPart__contains=word) | Q(lastPart__contains=word) | Q(firstPartKana__contains=word) | Q(secondPartKana__contains=word) | Q(thirdPartKana__contains=word) | Q(fourthPartKana__contains=word) | Q(lastPartKana__contains=word) for word in words] 
                

            #古典(予定)
            else:
                searchTime = 0
                return render(request, 'search/result.html', {'target': target, 'query': " ".join(words), 'time': searchTime, 'results': []})                


            query = queries.pop()
            for item in queries:
                query |= item

            if target == "haikai" or not target:
                results = Haikai.objects.filter(query)

            elif target == "tanka":
                results = Tanka.objects.filter(query)
            
            else:
                results = []

            searchTime = time.time() - searchTime
            return render(request, 'search/result.html', {'target': target, 'query': " ".join(words), 'time': searchTime, 'results': results})