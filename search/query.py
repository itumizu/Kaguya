import logging
import sys

import re
from django.db.models import Q

import graphene
import graphql_jwt
from graphql_jwt.decorators import login_required
from graphene_django.types import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
# from graphene_django_extras import DjangoFilterListField
import graphene_django_optimizer as gql_optimizer
from graphql_relay import from_global_id

from search.models import Haikai, Author, Collection, Year
from .schema import HaikaiType, CollectionType, AuthorType, YearType

class Query(graphene.ObjectType):
    # haikai = DjangoFilterListField(HaikaiType)s
    # collection = DjangoFilterConnectionField(CollectionType)
    # author = DjangoFilterConnectionField(AuthorType)
    # year = DjangoFilterConnectionField(YearType)
    # a = graphene.Node.Field(HaikaiType)
    haikai = DjangoFilterConnectionField(HaikaiType, search=graphene.String())

    def resolve_haikai(self, info, search=None, **kwargs):
        # The value sent with the search parameter will be in the args variable

        if search:
            query = re.sub(r"\s+", " ", re.sub(r'^\s+|\s+$', '', search))
            words = re.split(r"\s", query)

            queries = [Q(firstPart__contains=word) | Q(secondPart__contains=word) | Q(lastPart__contains=word) | Q(firstPartKana__contains=word) | Q(secondPartKana__contains=word) | Q(lastPartKana__contains=word) | Q(collection__name__contains=word) | Q(collection__parent__name__contains=word) | Q(author__name__contains=word) for word in words]
            
            query = queries.pop()
            for item in queries:
                (query) &= item
            
            return Haikai.objects.filter(query)

        return Haikai.objects.none()