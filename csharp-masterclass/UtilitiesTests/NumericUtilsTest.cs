using NUnit.Framework;
using Utilities;

namespace UtilitiesTests;

[TestFixture]
internal class NumericUtilsTest
{
    [Test]
    public void GetEvenSumUpTo_ShallReturnZero_ForZeroInput()
    {
        var max = 0;
        var expected = 0;

        var sum = NumericUtils.GetEvenSumUpTo(max);

        Assert.AreEqual(expected, sum, $"Expected is not equal to {expected} for {max}");
    }

    [TestCase(2, 2)]
    [TestCase(5, 6)]
    [TestCase(11, 30)]
    [TestCase(1_000_012, 898_396_874)]
    // [TestCaseSource(nameof(GenerateTestCases))] // - use to bypass attribute constructor limitation
    public void GetEvenSumUpTo_ShallReturnValidResult_ForValidInput(int max, int expected)
    {
        var sum = NumericUtils.GetEvenSumUpTo(max);

        Assert.AreEqual(expected, sum, $"Expected is not equal to {expected} for {max}");
    }

    private static IEnumerable<object> GenerateTestCases()
    {
        return new[]
        {
            new object[] { 2, 2 },
            new object[] { 5, 6 },
        };
    }
}
