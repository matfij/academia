using System;
using System.Data.Common;

record Dict(string key, string value);

// for small data types - not stored in program memory
struct PlayerEq
{
    public string helmet;
    public string sword;
}

// enforces implementation
abstract class Blueprint
{
    public int Index {  get; private set; }

    public abstract void Execute();
}

interface IItem
{
    string name { get; set; }
    int value { get; set; }
}

file class Program
{
    public string Domain => "PHP Style, readonly";

    private string _name;
    public string Name
    {
        get { return _name.ToUpper(); }
        private set { _name = value.ToLower(); }
    }

    public record Dict(string key, string val);

    // contructor
    public Program(string name)
    {
        this._name = name;
        Dict dict = new Dict("black", "czarny");
    }

    // deconstructor (domain, name) = instance;
    public void Deconstruct(out string domain, out string name)
    {
        domain = this.Domain;
        name = this.Name;
    }

    public static void Main()
    {
        PrintToConsole();
        DeclareVariables(5);
    }

    protected static void PrintToConsole()
    {
        Console.WriteLine("Hello there");
    }

    private static void DeclareVariables(int init)
    {
        int sum = 3 + init;
        float percentage = 0.7f;
        double interest = 5.55;
        decimal money = 1.2345M;

        var name = "Alex";

        DateTime today = DateTime.Now;

        Console.WriteLine("Some numbers: " + sum + ',' + percentage + ',' + interest + ',' + money);
    }

    private void Destructering()
    {
        var dict = new Dict("banana", "banan");
        var (key, val) = dict;
    }

    private void ControlFlow(int input)
    {
        if (input > 9)
        {
            Console.WriteLine("Two-digit number");
        }
        else if (input < 0)
        {
            Console.WriteLine("Negative number");
        }
        else
        {
            Console.WriteLine("Some number");
        }

        switch (input)
        {
            case 0:
                {
                    Console.WriteLine("zero");
                    break;
                }
            default:
                {
                    Console.WriteLine("some number");
                    break;
                }
        }

        // functional switch assignment, nice!
        var inputStrnig = input switch
        {
            0 => "zero",
            _ => "number",
        };
    }

    private void Loops(int input)
    {
        for (var i = 0; i < input; i++)
        {
            Console.WriteLine(i);
        }

        while (false)
        {
            // infinite!
        }

        int[] intList = { 1, 2, 3, 4, 5 };
        foreach (var i in intList)
        {
            Console.WriteLine(i);
        }
    }

    private void Collections()
    {
        // implement IEnumerable
        var list = new List<int>([1, 2]);
        var dict = new Dictionary<string, int>();
        var queue = new Queue<int>([1, 2, 3]);

        // map
        var list2 = list.Select(x => 2 * x);

        // reduce
        var list3 = list.Aggregate(0, (total, current) => current > 0 ? total + current : total);
    }

    private async void Async()
    {
        await Task.Delay(1000);
    }

    private string GenericFunction<T>(T item) where T :IItem
    {
        return item.name;
    }
}
