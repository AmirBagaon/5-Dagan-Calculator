from django.shortcuts import render
from .models import *
import datetime

from .forms import *

from django import db
db.connections.close_all()

# print(b.Debtors.all())

# p1 = Person(name="Amir")
# p1.save()
# p2 = Person(name="Moshe")
# p2.save()
# b = Purchase(item_name="Jeans")
# b.save()
# b.Buyer.add(p1)
# b.Debtors.add(p2)
# b.Debtors.create(name='Someone')
# b.save()

# b = Purchase(item_name="Jeans", Buyer=p1, Debtors=p2)

context = {}
persons = Person.objects.all()
purchases = Purchase.objects.all()
debts = Debt.objects.all()

def getContext():
    context = {}
    persons = Person.objects.all()
    purchases = Purchase.objects.all()
    debts = Debt.objects.all()
    context['persons'] = persons
    context['purchases'] = purchases
    context['debts'] = debts
    return context
    

# for person in persons:
#     print(person, person.getTotalOwed(), person.getTotalOwes())


items = purchases.filter(debtors__name="שרי")
items = purchases.filter(buyers__name="אפרת")
# items = purchases.filter(price=20)

# print(items.query)
# print(len(items))
# for item in items:
#     print(item.getContent())
# print("##############")
# print(purchases[0].getContent())
# print(purchases[1].getContent())
# print("##############")

def home(request):

    if request.method=="POST":
        print("POSTTTTTTTTTTTTTTTTTTTTTTTTTT")
        email = request.POST['exampleInputEmail1']
        pswd = request.POST['pswd'] 
        print(email)
        print(pswd)
        ins = Details(email=email, pswd=pswd)
        ins.save()
        ins2 = Details(email="bla@gmail.com", pswd="9999")
        ins2.save()
        
    elif request.method=="GET":
        print("GETTTTTTTTTTTTTTTTTTTTTTTTTTT")

    return render(request, "main/home.html")

def base_page(request):
    return render(request, "main/base.html")

def person_create_view(request):
    form = PersonForm(request.POST or None)
    if form.is_valid():
        form.save()
    print("h2")
    context = {
        'form': form
    }
    return render(request, "main/person_create.html", context)


def person_create_view(request):
    form = RawPurchaseForm()
    if request.method=="POST":
        form = RawPurchaseForm(request.POST)
        print("#########################")
        if form.is_valid():
            print("form-good: ", form.cleaned_data)
            Purchase.objects.create(**form.cleaned_data)
        else:
            print ("form-errors: ", form.errors)
        print("#########################")

    context = {
        'form': form
    }
    return render(request, "main/person_create.html", context)

def person2_create_view(request):
    print("h1")
    form = PersonForm(request.POST or None)
    if form.is_valid():
        form.save()
    print("h2")
    context = {
        'form': form
    } 
    return render(request, "main/person_create.html", context)

def add_purchase(request):
    context = getContext()
    context['current_day'] = datetime.datetime.now().strftime ("%Y-%m-%d")

    if request.method=="GET":
        return render(request, "main/add_purchase.html", context)

    if request.method=="POST":
        product_name = request.POST['product_name'] 
        product_price = request.POST['product_price']
        product_date = request.POST['product_date']
        product_buyers = request.POST.getlist('product_buyers') 
        product_debtors = request.POST.getlist('product_debtors') 

        print(request.POST)
        print("product_name: ", product_name)
        print("product_price: ", product_price)
        print("product_date: ", product_date)
        print("product_buyers: ", product_buyers)
        print("product_debtors: ", product_debtors)
        
        #If not valid, return it back to the form and present errors
        is_valid, errors = purchase_form_is_valid(request.POST)
        if not is_valid:
            context.update(errors)
            context["data"] = request.POST
            return render(request, "main/add_purchase.html", context)



        ### Creating Purchase instance ###
        purchase_ins = Purchase(item_name=product_name, price=product_price, date=product_date)
        purchase_ins.save()

        for p_buyer in product_buyers:
            p1 = Person.objects.get(name=p_buyer)
            purchase_ins.buyers.add(p1)
        
        for p_debtor in product_debtors:
            p2 = Person.objects.get(name=p_debtor)
            purchase_ins.debtors.add(p2)
        
        ### Creating Debt instance ###
        each_price = float(float(product_price) / (len(product_debtors)+len(product_buyers)))
        for p_buyer in product_buyers:
            for p_debtor in product_debtors:
                #if there is more than 1 buyer, every debtor will own each buyer: (the amount he needs to pay / #buyers)
                #i.e price=200, 2 buyers, 2 debtors, each_price = 50, each debtor pay 25 to each buyer
                debt_price = each_price / len(product_buyers)
                
                p1 = Person.objects.get(name=p_buyer)
                p2 = Person.objects.get(name=p_debtor)
                
                debt_ins = Debt(purchase=purchase_ins, price=debt_price, buyer=p1, debtor=p2)
                debt_ins.save()
        # ins.Buyer.add(p1)
        # ins.Debtors.add(p2)
        success_message = f"המוצר '{product_name}' התווסף בהצלחה!"
        context['success_message'] = success_message
        return render(request, "main/add_purchase.html", context)

def calculator(request):
    context = getContext()
    return render(request, "main/calculator.html", context)

def buy_history(request):
    context = getContext()
    return render(request, "main/buy_history.html", context)

def debts_details(request):
    context = getContext()
    colors = {}

    print("######")
    # for p in purchases:
    #     my_filter = Debt.objects.filter(purchase=p)
    #     print(my_filter)

    for d in debts:
        colors[f"color_{d.purchase.id}"] = generateRandomColor()
    
    # items = purchases.filter(debtors__name="שרי")
    print("######")

    context['colors'] = colors

    return render(request, "main/debts_details.html", context)

def dynamic_lookup_view(request, p_name):
    context = getContext()
    ins = Person.objects.get(name=p_name)
    context["current"] = ins
    return render(request, "main/person_details.html", context)
