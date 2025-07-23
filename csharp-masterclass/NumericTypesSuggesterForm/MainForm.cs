using System.Numerics;

namespace NumericTypesSuggesterForm
{
    public partial class MainForm : Form
    {
        private BigInteger? _minValue;
        private BigInteger? _maxValue;
        private bool? _isFloat;
        private bool? _isPrecise;
        private NumericTypeManager _typeManager;

        public MainForm()
        {
            InitializeComponent();
            _typeManager = new NumericTypeManager();
            _typeManager.SuggestedTypeChange += (sender, type) => SuggestedType.Text = type;
        }

        private void ValueTextBox_KeyPressed(object sender, KeyPressEventArgs e)
        {
            if (!ValidateNumericInput(e.KeyChar, (TextBox)sender))
            {
                e.Handled = true;
            }
        }

        private void MinValueTextBox_TextChanged(object sender, EventArgs e)
        {
            _minValue = BigInteger.TryParse(MinValueTextBox.Text, out var value) ? value : null;
            _typeManager.SuggestType(_minValue, _maxValue, _isFloat, _isPrecise);
            ValidateNumericFields();
        }

        private void MaxValueTextBox_TextChanged(object sender, EventArgs e)
        {
            _maxValue = BigInteger.TryParse(MaxValueTextBox.Text, out var value) ? value : null;
            _typeManager.SuggestType(_minValue, _maxValue, _isFloat, _isPrecise);
            ValidateNumericFields();
        }

        private void IsFloatCheckbox_CheckedChange(object sender, EventArgs e)
        {
            IsPreciseCheckbox.Visible = IsFloatCheckbox.Checked;
            _isFloat = IsFloatCheckbox.Checked;
            _typeManager.SuggestType(_minValue, _maxValue, _isFloat, _isPrecise);
        }

        private void IsPreciseCheckbox_CheckedChange(object sender, EventArgs e)
        {
            _isPrecise = IsPreciseCheckbox.Checked;
            _typeManager.SuggestType(_minValue, _maxValue, _isFloat, _isPrecise);
        }

        private void ValidateNumericFields()
        {
            if (!IsInputComplete())
            {
                return;
            }
            if (_maxValue < _minValue)
            {
                MaxValueTextBox.BackColor = Color.Red;
            }
            else
            {
                MaxValueTextBox.BackColor = Color.White;
            }
        }

        private bool ValidateNumericInput(char key, TextBox sender)
        {
            var isDigit = char.IsAsciiDigit(key);
            var isControl = char.IsControl(key);
            var isValidMinusSign =
                key == '-'
                && sender.SelectionStart == 0
                && !sender.Text.Contains('-');
            return isDigit || isControl || isValidMinusSign;
        }

        private bool IsInputComplete()
        {
            return 
                MinValueTextBox.Text.Length > 0 && MinValueTextBox.Text != "-"
                && MaxValueTextBox.Text.Length > 0 && MaxValueTextBox.Text != "-";
        }
    }
}
