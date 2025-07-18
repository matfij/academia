
using Events;

var priceChangeNotifier = new PriceChangeNotifier();
var emailNotifier = new EmailNotifier();
var textNotifier = new TextNotifier();

priceChangeNotifier.AttachObserver(emailNotifier);

priceChangeNotifier.ChangePrice();

priceChangeNotifier.AttachObserver(textNotifier);

priceChangeNotifier.ChangePrice();
