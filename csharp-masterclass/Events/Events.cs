namespace Events;

//public delegate void OnBalanceDecreased(decimal balance);

public class BalanceDecreasedEventArgs(decimal decrease) : EventArgs
{
    public decimal Decrease { get; set; } = decrease;
}

public class BankAccount(decimal initialBalance)
{
    public decimal Balance { get; private set; } = initialBalance;

    public event EventHandler<BalanceDecreasedEventArgs>? OnBalanceDecreased;

    public void DecreaseBalance(decimal price)
    {
        Balance -= price;
        OnBalanceDecreased?.Invoke(
            this,
            new BalanceDecreasedEventArgs(price));
    }

}

public class User(decimal cash, decimal moneyInBank)
{
    public decimal Funds { get; private set; } = cash + moneyInBank;

    public void ReduceFunds(object? sender, BalanceDecreasedEventArgs args)
    {
        Console.WriteLine(sender);
        Funds -= args.Decrease;
    }
}
