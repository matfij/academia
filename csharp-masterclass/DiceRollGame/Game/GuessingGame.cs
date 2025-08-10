using DiceRollGame;
using UserCommunication;

namespace Game;

public enum GameResult
{
    Victory,
    Loss
}

public class GuessingGame
{
    private readonly IDice _dice;
    private readonly IUserCommunication _userCommunication;
    private const int InitialTries = 3;

    public GuessingGame(
        IDice dice,
        IUserCommunication userCommunication)
    {
        _dice = dice;
        _userCommunication = userCommunication;
    }

    public GameResult Play()
    {
        var diceRollResult = _dice.Roll();
        _userCommunication.ShowMessage(String.Format(Resource.GameIntroduction, diceRollResult));

        var triesLeft = InitialTries;
        while (triesLeft > 0)
        {
            var guess = _userCommunication.ReadInteger(Resource.EnterNumberMessage);
            if (guess == diceRollResult)
            {
                return GameResult.Victory;
            }
            _userCommunication.ShowMessage(Resource.WrongNumber);
            --triesLeft;
        }
        return GameResult.Loss;
    }

    public void PrintResult(GameResult gameResult)
    {
        string message = gameResult == GameResult.Victory
            ? Resource.YouWon
            : Resource.YouLost;

        _userCommunication.ShowMessage(message);
    }
}
