from django import forms
from .models import Person

class PersonForm(forms.ModelForm):
    class Meta:
        model = Person
        fields = ['name']


class RawPurchaseForm(forms.Form):
    item_name = forms.CharField(label='שם המוצר')
    price = forms.DecimalField()



def purchase_form_is_valid(data):
    errors = {}
    valid = True
    if 'product_name' not in data or not data['product_name']: #Not send or empty
        errors['product_name_error'] = "יש לכתוב את שם המוצר!"
        valid = False
    
    if 'product_price' not in data or (not data['product_price']):
        errors['product_price_error'] = "יש לכתוב מחיר!"
        valid = False
    elif data['product_price'].replace('.','',1).isdigit() == False:
        errors['product_price_error'] = "מחיר המוצר צריך להיות מ0 ומעלה!"
        valid = False
    
    if 'product_date' not in data or (not data['product_date']):
        errors['product_date_error'] = "יש למלא תאריך!"
        valid = False
    elif int(data['product_date'].split("-")[0]) < 1900:
        print("herrrrreeee")
        errors['product_date_error'] = "נו באמת, לפני שנת 1900?!"
        valid = False

    if 'product_buyers' not in data or (not data['product_buyers']):
        errors['product_buyers_error'] = "יש לבחור לפחות מישהי אחת!"
        valid = False

    if 'product_debtors' not in data or (not data['product_debtors']):
        errors['product_debtors_error'] = "יש לבחור לפחות מישהי אחת!"
        valid = False
    
    #Check that owes and owed are not the same person
    elif data['product_buyers'] and data['product_debtors']: 
        lst1 = data.getlist('product_buyers')
        lst2 = data.getlist('product_debtors')
        
        x = list(set(lst1).intersection(lst2))
        if x: #if there are elements in x, it means there are common elements on the 2 lists
            s = ", ".join(reversed(x))
            act = "אינה יכולה" if len(x)<=1 else "אינן יכולות"
            errors['product_debtors_error'] = f"{s} {act} להופיע גם כמי שקנתה וגם כמי שצריכה להחזיר!"
            valid = False

    return valid, errors

def generateRandomColor():
        import random
        # # r = lambda: random.randint(0,255)
        # # color = ('#%02X%02X%02X' % (r(),r(),r())) #Something from the form: #FFFFFF
        # # color = "#%06x" % random.randint(0, 0xFFFFFF)
        # number = random.randint(0,999)
        # hue = number * 137.508 # use golden angle approximation
        # return f"hsl({hue},50%,75%)"

        Colors = {
            # "aqua" :	"#00ffff",
            # "azure" : "#f0ffff",
            # "beige" : "#f5f5dc",
            "black" : "#000000",
            "blue" : "#0000ff",
            "brown" : "#a52a2a",	
            # "cyan" : "#00ffff",
            "darkblue" : "#00008b",
            "darkcyan" : "#008b8b",
            "darkgrey" : "#a9a9a9",
            # "darkgreen" : "#006400",
            # "darkkhaki" : "#bdb76b",
            "darkmagenta" :	 "#8b008b",
            # "darkolivegreen" : "#556b2f",
            "darkorange" : "#ff8c00",
            "darkorchid" : "#9932cc",
            "darkred" : "#8b0000",
            "darksalmon" : "#e9967a",
            "darkviolet" : "#9400d3",
            "fuchsia" : "#ff00ff",
            # "gold" : "#ffd700",
            # "green" : "#008000",
            "indigo" : "#4b0082",
            "khaki" : "#f0e68c",
            # "lightblue" : "#add8e6",
            # "lightcyan" : "#e0ffff",
            # "lightgreen" : "#90ee90",
            # "lightgrey" : "#d3d3d3",
            # "lightpink" : "#ffb6c1",
            # "lightyellow" : "#ffffe0",
            # "lime" : "#00ff00",
            "magenta" : "#ff00ff",
            "maroon" : "#800000",
            "navy" : "#000080",
            "olive" : "#808000",
            "orange" : "#ffa500",
            "pink" : "#ffc0cb",
            "purple" : "#800080",
            "violet" : "#800080",
            "red" : "#ff0000",
            "silver" : "#c0c0c0",
            # "white" : "#ffffff",
            # "yellow" : "#ffff00"
        }

        color = random.choice(list(Colors)) #Option 1
        # color = "#%06x" % random.randint(0, 0xFFFFFF) #Option 2
        # color = "#%03x" % random.randint(0, 0xFFF) #Option 3
        return color