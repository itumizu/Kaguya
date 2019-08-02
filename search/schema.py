import logging
import sys

import graphene
import graphql_jwt
from graphql_jwt.decorators import login_required
from graphene_django.types import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
import graphene_django_optimizer as gql_optimizer
from graphql_relay import from_global_id

from search.models import Haikai, Author, Collection, Year

class CountableConnection(graphene.relay.Connection):
    total_count = graphene.Int()
    class Meta:
        abstract = True
        
    def resolve_total_count(self, info):
        return self.length

class HaikaiType(DjangoObjectType):
    class Meta:
        model = Haikai
        filter_fields = ['firstPart', 'secondPart', 'lastPart', 'firstPartKana', 'secondPartKana', 'lastPartKana', 'collection', 'author', 'year']

        interfaces = (graphene.relay.Node, )
        connection_class = CountableConnection

class CollectionType(DjangoObjectType):
    class Meta:
        model = Collection
        filter_fields = []

        interfaces = (graphene.relay.Node, )

class AuthorType(DjangoObjectType):
    class Meta:
        model = Author
        filter_fields = []

        interfaces = (graphene.relay.Node, )

class YearType(DjangoObjectType):
    class Meta:
        model = Year
        filter_fields = []
        
        interfaces = (graphene.relay.Node, )