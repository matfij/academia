using Game;
using NUnit.Framework;

namespace UtilitiesTests.DiceRollGameTests;

[TestFixture]
internal class DiceTest
{
    private Random _random;
    private Dice _cut;

    [SetUp]
    public void Setup()
    {
        _random = new Random();
        _cut = new Dice(_random);
    }

    [Test]
    public void Roll_ShallReturnNumberBetweenOneAndSix()
    {
        for (int i = 0; i < 100; i++)
        {
            var result = _cut.Roll();

            Assert.Greater(result, 0);
            Assert.Less(result, 7);
        }
    }
}
