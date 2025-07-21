namespace Events;

public record struct WeatherData(int? Temperature, int? Humidity);

public class WeatherDataAggregator
{
    public IEnumerable<WeatherData> WeatherHistory => _weatherHistory;
    private List<WeatherData> _weatherHistory = new();

    public void GetNotifiedAboutNewData(object? sender, WeatherDataEventArgs args)
    {
        _weatherHistory.Add(args.WeatherData);
    }
}


public class WeatherStation
{
    public event EventHandler<WeatherDataEventArgs>? WeatherMeasured;

    public void Measure()
    {
        int temperature = 25;

        OnWeatherMeasured(new() { Temperature = temperature });
    }

    private void OnWeatherMeasured(WeatherData weatherData)
    {
        WeatherMeasured?.Invoke(this, new WeatherDataEventArgs(weatherData));
    }
}

public class WeatherBaloon
{
    public event EventHandler<WeatherDataEventArgs>? WeatherMeasured;

    public void Measure()
    {
        int humidity = 50;

        OnWeatherMeasured(new() { Humidity = humidity });
    }

    private void OnWeatherMeasured(WeatherData weatherData)
    {
        WeatherMeasured?.Invoke(this, new WeatherDataEventArgs(weatherData));
    }
}

public class WeatherDataEventArgs : EventArgs
{
    public WeatherData WeatherData { get; }

    public WeatherDataEventArgs(WeatherData weatherData)
    {
        WeatherData = weatherData;
    }
}
