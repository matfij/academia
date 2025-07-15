using TicketsDataAggregator;

string _format = "*.pdf";
string _readPath = @"C:\Users\mateu\Downloads\Tickets\Tickets";
string _writePath = @"C:\Users\mateu\Downloads\tickets.txt";

ITicketsReader reader = new PdfTicketsReader();
ITicketsParser parser = new TextTicketsParser();
ITicketsWriter writer = new TextTicketsWriter();

var fileEntries = Directory.GetFiles(_readPath, _format);
var allTickets = new List<Ticket>();

foreach (var entry in fileEntries)
{
    var content = reader.Read(entry);
    var tickets = parser.Parse(content);
    allTickets.AddRange(tickets);
}

writer.WriteAll(_writePath, allTickets);

Console.ReadLine();
