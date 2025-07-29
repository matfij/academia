using NUnit.Framework;
using Utilities;

namespace UtilitiesTests;

[TestFixture]
internal class NumericUtilsTest
{
    [Test]
    public void Test_GetEvenSumUpTo()
    {
        var max = 0;

        var sum = NumericUtils.GetEvenSumUpTo(max);

        Assert.AreEqual(0, sum);
    }
}
