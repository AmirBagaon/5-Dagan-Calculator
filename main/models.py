from django.db import models
import datetime
from django.utils.translation import gettext as _
from django.db.models import Q
# Create your models here.

class Person(models.Model):
    name = models.CharField(max_length=40)

    # class Meta:
    #     ordering = ['name']

    def __str__(self):
        return self.name
    
    def getOwedFrom(self):
        # Returns QuerySet that contains all Purchases where someone owed this person
        purchases = Purchase.objects.all()
        items = purchases.filter(buyers__name=self.name)
        return items
    
    def getTotalOwed(self):
        queries = self.getOwedFrom()
        amount = 0
        for q in queries:
            amount += (q.price / len(q.getBuyers()))
        return amount
    
    def getPersonDebts(self):
        return Debt.objects.filter(Q(buyer__name=self.name) | Q(debtor__name=self.name)).order_by('was_paid')

    def getTotalOwes(self):
        queries = self.getOwesTo()
        amount = 0
        for q in queries:
            amount += (q.price / len(q.getDebtors()))
        return amount

    def getOwesTo(self):
        # Returns QuerySet that contains all Purchases where this person owes to others
        purchases = Purchase.objects.all()
        items = purchases.filter(debtors__name=self.name)
        return items

    def getAllOwes(self):
        debts = Debt.objects.filter(was_paid=False)
        ### Get all person debts to others
        without_self = debts.exclude(buyer__name=self.name)
        self_is_debtor = without_self.filter(debtor__name=self.name)

        calculate_dict = {}
        persons = Person.objects.all()
        for p in persons:
            if p.name == self.name:
                continue
            
            sum = 0
            query = self_is_debtor.filter(buyer__name=p.name) #All debts that buyer is the current p in the for loop
            for d in query: #For all those kind of debts
                sum -= d.price
            print(p.name, sum)
            calculate_dict[p.name] = float(sum)
        print(calculate_dict)
        ### Until here - Get all person debts to others

        ### Get all others debts to this person
        without_self = debts.exclude(debtor__name=self.name)
        print(without_self)
        self_is_buyer = without_self.filter(buyer__name=self.name)
        print(self_is_buyer)

        for p in persons:
            if p.name == self.name:
                continue
            
            sum = 0
            query = self_is_buyer.filter(debtor__name=p.name) #All debts debtor is the current p in the for loop
            
            for d in query: #For all those kind of debts
                sum += d.price
            
            calculate_dict[p.name] += float(sum)
        ### Until here - Get all others debts to this person  
        
        #Go through the dict and create a list with the text
        sorted_dict = dict(sorted(calculate_dict.items(), key=lambda item: item[1]))
        
        txt = []
        for key,value in sorted_dict.items():
            if value == 0:
                continue
            if value < 0:
                txt.append(f"חייבת ל{key}: {abs(value)}")
            else:
                txt.append(f"זכאית מ{key}: {value}")
        print(txt)
        return txt #Query set 

class Details(models.Model):
    email = models.CharField(max_length=200)
    pswd = models.CharField(max_length=200)


# class Purchase(models.Model):
#     title = models.CharField(max_length=30)

#     class Meta:
#         ordering = ['title']

#     def __str__(self):
#         return self.title

class Purchase(models.Model):
    item_name = models.CharField(max_length=100)
    buyers = models.ManyToManyField(Person, related_name='Buyers')
    debtors = models.ManyToManyField(Person, related_name='Debtors')
    price = models.DecimalField(decimal_places=2, max_digits=100, default=0)
    date = models.DateField(_("Date"), default=datetime.date.today)

    # class Meta:
    #     ordering = ['item_name']

    def __str__(self):
        return self.item_name

    def getBuyers(self):
        return [x for x in self.buyers.all()]
    def getBuyersNames(self):
            return ", ".join([x.name for x in self.buyers.all()])

    def getDebtors(self):
        return [x for x in self.debtors.all()]

    def getDebtorsNames(self):
            return ", ".join([x.name for x in self.debtors.all()])
        
    def getContent(self):
        
        d = [self.item_name, self.price, self.date, self.getBuyers(), self.getDebtors()]
        return d


class Debt(models.Model):

    purchase = models.ForeignKey(Purchase, on_delete=models.CASCADE, null=True)
    debtor = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='Debtor')
    buyer = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='Buyer')
    
    price = models.DecimalField(decimal_places=2, max_digits=100, default=0)
    was_paid = models.BooleanField(default=False)

    class Meta:
        ordering = ['purchase']
    def __str__(self):
        return f"{self.debtor} {self.price} ל{self.buyer}"
