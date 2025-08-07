using Game;
using UserCommunication;

var random = new Random();
var dice = new Dice(random);
var console = new SystemConsole();
var userCommunication = new ConsoleUserCommunication(console);
var guessingGame = new GuessingGame(dice, userCommunication);

GameResult gameResult = guessingGame.Play();
guessingGame.PrintResult(gameResult);

Console.ReadKey();
