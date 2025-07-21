using Events;

//var priceChangeNotifier = new PriceChangeNotifier();
//var emailNotifier = new EmailNotifier();
//var textNotifier = new TextNotifier();

//priceChangeNotifier.AttachObserver(emailNotifier);

//priceChangeNotifier.ChangePrice();

//priceChangeNotifier.AttachObserver(textNotifier);

//priceChangeNotifier.ChangePrice();


//var bank = new BankAccount(5000);
//var user = new User(100, bank.Balance);

//bank.OnBalanceDecreased += user.ReduceFunds;

//bank.DecreaseBalance(178);

//Console.WriteLine(user.Funds);

//bank.OnBalanceDecreased -= user.ReduceFunds;
//bank.DecreaseBalance(9000);

//Console.WriteLine(user.Funds);


var weatherDataAggregator = new WeatherDataAggregator();
var weatherStation = new WeatherStation();
var weatherBaloon = new WeatherBaloon();

weatherStation.WeatherMeasured += weatherDataAggregator.GetNotifiedAboutNewData;
weatherBaloon.WeatherMeasured += weatherDataAggregator.GetNotifiedAboutNewData;

weatherStation.Measure();
weatherBaloon.Measure();

Console.WriteLine(weatherDataAggregator.WeatherHistory);
