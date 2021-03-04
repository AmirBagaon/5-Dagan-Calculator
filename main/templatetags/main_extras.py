from django import template
import re
from django import template
from django.conf import settings

register = template.Library()
numeric_test = re.compile("^\d+$")

@register.filter
def addstr(arg1, arg2):
    """concatenate arg1 & arg2"""
    return str(arg1) + str(arg2)

@register.filter
def getattribute(value, arg):
    """Gets an attribute of an object dynamically from a string name"""
    if arg in value:
        return value[arg]
        
    if hasattr(value, str(arg)):
        return getattr(value, arg)
    elif hasattr(value, 'has_key') and arg in value:
        return value[arg]
    elif numeric_test.match(str(arg)) and len(value) > int(arg):
        return value[int(arg)]
    else:
        return "blablabla"
