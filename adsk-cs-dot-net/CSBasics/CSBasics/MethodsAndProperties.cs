using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CSBasics
{
    internal class CookieCustomer
    {
        // different property styles: auto (no get/set logic), full (custom get/set), expression bodied (=>)
        public int Id { get; }
        private string _name;
        public string Name
        {
            get => _name;
            set
            {
                ValidateName(value);
                _name = value;
            }
        }
        public string? Notes { get; set; }
        public char FirstChar => Name[0];

        public CookieCustomer(int id, string name, string? notes = null)
        {
            // guard clause - prevent error propagation - short circuit
            // validation could be extracted to a separate function but this will modify stack trace
            if (string.IsNullOrEmpty(name))
            {
                throw new ArgumentException("name must be a defined string");
            }
            if (id <= 0)
            {
                throw new ArgumentException("id must be a number greater than zero");
            }
            Id = id;
            Name = name;
            Notes = notes;
        }

        public override string ToString()
        {
            return $"Customer Id={Id}, Name={Name}";
        }

        private void ValidateName(string name)
        {
            if (!string.IsNullOrEmpty(name))
            {
                throw new ArgumentException("name must be a defined string");
            }
        }

    }

    internal class Sale
    {
        public CookieCustomer Customer { get; }
        public decimal Value { get; }

        public Sale(CookieCustomer customer, decimal value)
        {
            if (customer == null)
            {
                throw new ArgumentException("customer must be defined");
            }
            Customer = customer;
            Value = value;
        }

    }

    internal class SalesList
    {
        private List<Sale> _sales = new();

        public IEnumerable<Sale> EnumerateSales()
        {
            foreach (Sale sale in _sales)
            {
                yield return sale;
            }
        }

        public SalesList AddSale(Sale sale)
        {
            _sales.Add(sale);
            // fluent coding - method calls chaining .filter().map().sort()
            // use value returnet from prev operations during next
            // might not offer the best performance - copying itself
            return this;
        }

        // tuple return type (System.ValueTuple under the hood)
        public (string CustomerName, decimal TotalValue, int SalesNo) GetHighestValueCustomer()
        {
            // LINQ - language integrated query to perform complex queries on collections in a unified, declarative manner
            // computation costly operation
            var customerBySpend = from transaction in _sales
                                  group transaction by transaction.Customer into grouping
                                  let totalValue = grouping.Select(x => x.Value).Sum()
                                  let salesCount = grouping.Count()
                                  orderby totalValue descending
                                  select (grouping.Key.Name, totalValue, salesCount);
            return customerBySpend.First();
        }

        public void ConsumeGetHighestValueCustomer()
        {
            // tuple decontruction
            (string name, decimal totalValue, int salesNo) = GetHighestValueCustomer();
            Console.WriteLine($"{name} | {totalValue} | {salesNo}");

            var highCus = GetHighestValueCustomer();
            Console.WriteLine($"{highCus.CustomerName} | {highCus.TotalValue} | {highCus.SalesNo}");
        }

        // multiple values can also be returned with "out" parameters (pass arguments by reference expect from classes)
        // by default arguments are passed by value
        public void IntSum(int a, int b, out int sum)
        {
            // sum is modified outside funciton scope
            sum = a + b;
        }

        // "in" can also be used to pass by reference with intention to improve perfomance
        // "ref" can also be used to pass by reference with intention to modify it
        // choosing correct modifier can enchance compiler error checking
        public decimal DecimalSum(in decimal a, ref decimal b)
        {
            return a + b;
        }
    }

}
