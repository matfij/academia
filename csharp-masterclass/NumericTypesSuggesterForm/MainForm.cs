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
        }

        private void ValueTextBox_KeyPressed(object sender, KeyPressEventArgs e)
        {
            if (!char.IsAsciiDigit(e.KeyChar) && !char.IsControl(e.KeyChar) && e.KeyChar != '-')
            {
                e.Handled = true;
                return;
            }
        }

        private void MinValueTextBox_TextChanged(object sender, EventArgs e)
        {
            _minValue = BigInteger.TryParse(MinValueTextBox.Text, out var value) ? value : null;
            _typeManager.SuggestType(_minValue, _maxValue, _isFloat, _isPrecise);
            SuggestedType.Text = _typeManager.SuggestedType;
        }

        private void MaxValueTextBox_TextChanged(object sender, EventArgs e)
        {
            _maxValue = BigInteger.TryParse(MaxValueTextBox.Text, out var value) ? value : null;
            _typeManager.SuggestType(_minValue, _maxValue, _isFloat, _isPrecise);
            SuggestedType.Text = _typeManager.SuggestedType;
        }

        private void IsFloatCheckbox_CheckedChange(object sender, EventArgs e)
        {
            IsPreciseCheckbox.Visible = IsFloatCheckbox.Checked;
            _isFloat = IsFloatCheckbox.Checked;
            _typeManager.SuggestType(_minValue, _maxValue, _isFloat, _isPrecise);
            SuggestedType.Text = _typeManager.SuggestedType;
        }

        private void IsPreciseCheckbox_CheckedChange(object sender, EventArgs e)
        {
            _isPrecise = IsPreciseCheckbox.Checked;
            _typeManager.SuggestType(_minValue, _maxValue, _isFloat, _isPrecise);
            SuggestedType.Text = _typeManager.SuggestedType;
        }
    }
}
