using NUnit.Framework;
using Utilities;

namespace UtilitiesTests.UtilitiesTests;

[TestFixture]
internal class FibonacciTest
{
    [Test]
    public void Generate_ShallThrowException_ForNegativeNumber()
    {
        var exception = Assert.Throws<ArgumentException>(() => Fibonacci.Generate(-1));

        Assert.AreEqual("n cannot be smaller than 0.", exception!.Message, "Invalid exception message");
    }

    [Test]
    public void Generate_ShallThrowException_ForTooLargeNumber()
    {
        var exception = Assert.Throws<ArgumentException>(() => Fibonacci.Generate(47));

        Assert.AreEqual(
            "n cannot be larger than 46, as it will cause numeric overflow.",
            exception!.Message,
            "Invalid exception message");
    }

    [TestCase(0, new int[] { })]
    [TestCase(1, new int[] { 0 })]
    [TestCase(2, new int[] { 0, 1 })]
    public void Generate_ShallReturnArbitraryNumber_ForSpecialCases(int input, int[] expected)
    {
        var result = Fibonacci.Generate(input);

        CollectionAssert.AreEqual(expected, result, $"Invalid result for {input}");
    }

    [TestCase(5, new int[] { 0, 1, 1, 2, 3 })]
    [TestCase(10, new int[] { 0, 1, 1, 2, 3, 5, 8, 13, 21, 34 })]
    public void Generate_ShallReturnCorrectArray_ForValidNumber(int input, int[] expected)
    {
        var result = Fibonacci.Generate(input);

        CollectionAssert.AreEqual(expected, result, $"Invalid result for {input}");
    }
}
