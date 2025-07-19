namespace Events;

public delegate void OnBalanceDecreased(decimal balance);

public class BankAccount
{
    public decimal Balance { get; private set; }

    public BankAccount(decimal initialBalance)
    {
        Balance = initialBalance;
    }

    public event OnBalanceDecreased OnBalanceDecreased;

    public void DecreaseBalance(decimal price)
    {
        Balance -= price;
        OnBalanceDecreased(price);
    }

}

public class User
{
    public decimal Funds { get; private set; }

    public User(decimal cash, decimal moneyInBank)
    {
        Funds = cash + moneyInBank;
    }

    public void ReduceFunds(decimal balanceReduced)
    {
        Funds -= balanceReduced;
    }
}
