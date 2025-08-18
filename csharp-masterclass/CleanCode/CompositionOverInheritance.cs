namespace CleanCode;

internal class CompositionOverInheritance
{
    // inheritance limitations:
    // bloated responsibilities of inhering classes, parent (abstract) class can't be used standalone
    // more coupling between based and derived classes
    // when adding functionality inheritance hierarchy grows rapidly 
    // harder unit testing - abstract members can't be tested directly, may duplicate testing in derived classes
    // harder representation in databases

    // benefits of composition
    // loose coupling - not depending on implementation details
    // better reusability - we can compose read/format independently and with other functionality
    // class can implement many interfaces
    // hierarchy will always be one level deep
    // easy unit testing - mocking

    public interface IDataReader
    {
        string Read();
    }

    public interface IDataFormatter
    {
        public string Format();
    }

    public class SqlDataReader : IDataReader
    {
        public string Read()
        {
            throw new NotImplementedException();
        }
    }


    public class TextDataFormatter(IDataReader reader) : IDataFormatter
    {

        private readonly IDataReader _reader = reader;

        public string Format()
        {
            var data = _reader.Read();
            return "text formatted: " + data;
        }
    }

    public class SpreadsheetDataFormatter(IDataReader reader) : IDataFormatter
    {
        private readonly IDataReader _reader = reader;

        public string Format()
        {
            var data = _reader.Read();
            return "spreadsheet formatted: " + data;
        }
    }
}
