namespace Events;

internal interface IObservable<TData>
{
    void AttachObserver(IObserver<TData> observer);
    void DetachObserver(IObserver<TData> observer);
    void Notify(TData data);
}

internal interface IObserver<TData>
{
    void Update(TData data);
}

internal class PriceChangeNotifier : IObservable<decimal>
{
    private readonly List<IObserver<decimal>> _observers = [];

    public void AttachObserver(IObserver<decimal> observer)
    {
        _observers.Add(observer);
    }

    public void DetachObserver(IObserver<decimal> observer)
    {
        _observers.Remove(observer);
    }

    public void ChangePrice()
    {
        var newPrice = Random.Shared.Next(0, 1_000_000);
        Notify(newPrice);
    }

    public void Notify(decimal data)
    {
        foreach (var observer in _observers)
        {
            observer.Update(data);
        }
    }
}

internal class EmailNotifier: IObserver<decimal>
{
    public void Update(decimal price)
    {
        Console.WriteLine($"Email: price changed to {price:C}");
    }
}

internal class TextNotifier : IObserver<decimal>
{
    public void Update(decimal price)
    {
        Console.WriteLine($"Text: price changed to {price:C}");
    }
}