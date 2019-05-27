from django import template
from django.utils.safestring import mark_safe
from django.template.defaultfilters import stringfilter
import markdown

register = template.Library()

@register.filter(name='markdown2html')
@stringfilter
def markdown2html(value):
    return markdown.markdown(value)