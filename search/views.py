import logging
import re
import time

from django.db.models import Q
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.shortcuts import render, HttpResponse, redirect
from django.views.decorators.csrf import csrf_exempt

from .decorators import ip_login_required
from .models import Collection, Author, Haikai, Tanka, Koten


@ip_login_required
def index(request):
    return render(request, 'search/index.html', {})

@csrf_exempt
@ip_login_required
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

        query = re.sub(r"\s+", " ", re.sub(r'^\s+|\s+$', '', request.GET['q']))
        
        if not query:
            searchTime = 0
            return render(request, 'search/result.html', {'target': target, 'query': "", 'time': searchTime, 'results': []})

        else:
            words = re.split(r"\s", query)

            # 俳諧
            if target == "haikai" or not target:
                queries = [Q(firstPart__contains=word) | Q(secondPart__contains=word) | Q(lastPart__contains=word) | Q(firstPartKana__contains=word) | Q(secondPartKana__contains=word) | Q(lastPartKana__contains=word) | Q(collection__name__contains=word) | Q(collection__parent__name__contains=word) | Q(author__name__contains=word) for word in words]
            
            #短歌
            elif target == "tanka":
                queries = [Q(firstPart__contains=word) | Q(secondPart__contains=word) | Q(thirdPart__contains=word) | Q(fourthPart__contains=word) | Q(lastPart__contains=word) | Q(firstPartKana__contains=word) | Q(secondPartKana__contains=word) | Q(thirdPartKana__contains=word) | Q(fourthPartKana__contains=word) | Q(lastPartKana__contains=word) | Q(collection__name__contains=word) | Q(collection__parent__name__contains=word) | Q(author__name__contains=word) for word in words] 
            
            #古典
            else:
                queries = [Q(text__contains=word) | Q(collection__name__contains=word) | Q(collection__parent__name__contains=word) | Q(author__name__contains=word) for word in words]         

            query = queries.pop()
            for item in queries:
                (query) &= item
            
            if target == "haikai" or not target:
                results = Haikai.objects.filter(query).select_related('author', 'collection', 'collection__parent')
                
            elif target == "tanka":
                results = Tanka.objects.filter(query).select_related('author', 'collection', 'collection__parent')
                
            else:
                results = Koten.objects.filter(query).select_related('author', 'collection', 'collection__parent')
            
            pageObject, paginator = paginate_query(request, results, settings.PAGE_PER_ITEM)

            searchTime = time.time() - searchTime
            return render(request, 'search/result.html', {'target': target, 'query': " ".join(words), 'time': searchTime, 'counts': len(results), 'pageObject': pageObject, 'paginator': paginator})
        

def paginate_query(request, queryset, count):
    paginator = Paginator(queryset, count)
    page = request.GET.get('page')

    try:
        page_obj = paginator.page(page)

    except PageNotAnInteger:
        page_obj = paginator.page(1)

    except EmptyPage:
        page_obj = paginator.page(paginator.num_pages)

    return page_obj, paginator