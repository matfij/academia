


namespace NumericTypesSuggesterForm
{
    partial class MainForm
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            MinValueLabel = new Label();
            IsFloatCheckbox = new CheckBox();
            MinValueTextBox = new TextBox();
            MaxValueTextBox = new TextBox();
            MaxValueLabel = new Label();
            IsPreciseCheckbox = new CheckBox();
            SuggestedTypeLabel = new Label();
            SuggestedType = new Label();
            SuspendLayout();
            // 
            // MinValueLabel
            // 
            MinValueLabel.AutoSize = true;
            MinValueLabel.Font = new Font("Segoe UI", 15F, FontStyle.Bold);
            MinValueLabel.Location = new Point(224, 108);
            MinValueLabel.Name = "MinValueLabel";
            MinValueLabel.Size = new Size(157, 41);
            MinValueLabel.TabIndex = 0;
            MinValueLabel.Text = "Min value";
            // 
            // IsFloatCheckbox
            // 
            IsFloatCheckbox.AutoSize = true;
            IsFloatCheckbox.Font = new Font("Segoe UI", 15F);
            IsFloatCheckbox.Location = new Point(455, 283);
            IsFloatCheckbox.Name = "IsFloatCheckbox";
            IsFloatCheckbox.Size = new Size(132, 45);
            IsFloatCheckbox.TabIndex = 2;
            IsFloatCheckbox.Text = "Is float";
            IsFloatCheckbox.UseVisualStyleBackColor = true;
            IsFloatCheckbox.CheckedChanged += IsFloatCheckbox_CheckedChange;
            // 
            // MinValueTextBox
            // 
            MinValueTextBox.Font = new Font("Segoe UI", 15F);
            MinValueTextBox.Location = new Point(455, 102);
            MinValueTextBox.Name = "MinValueTextBox";
            MinValueTextBox.Size = new Size(515, 47);
            MinValueTextBox.TabIndex = 3;
            MinValueTextBox.TextChanged += MinValueTextBox_TextChanged;
            MinValueTextBox.KeyPress += ValueTextBox_KeyPressed;
            // 
            // MaxValueTextBox
            // 
            MaxValueTextBox.Font = new Font("Segoe UI", 15F);
            MaxValueTextBox.Location = new Point(455, 200);
            MaxValueTextBox.Name = "MaxValueTextBox";
            MaxValueTextBox.Size = new Size(515, 47);
            MaxValueTextBox.TabIndex = 4;
            MaxValueTextBox.TextChanged += MaxValueTextBox_TextChanged;
            MaxValueTextBox.KeyPress += ValueTextBox_KeyPressed;
            // 
            // MaxValueLabel
            // 
            MaxValueLabel.AutoSize = true;
            MaxValueLabel.Font = new Font("Segoe UI", 15F, FontStyle.Bold);
            MaxValueLabel.Location = new Point(218, 203);
            MaxValueLabel.Name = "MaxValueLabel";
            MaxValueLabel.Size = new Size(163, 41);
            MaxValueLabel.TabIndex = 5;
            MaxValueLabel.Text = "Max value";
            // 
            // IsPreciseCheckbox
            // 
            IsPreciseCheckbox.AutoSize = true;
            IsPreciseCheckbox.Font = new Font("Segoe UI", 15F);
            IsPreciseCheckbox.Location = new Point(455, 334);
            IsPreciseCheckbox.Name = "IsPreciseCheckbox";
            IsPreciseCheckbox.Size = new Size(167, 45);
            IsPreciseCheckbox.TabIndex = 6;
            IsPreciseCheckbox.Text = "Is precise";
            IsPreciseCheckbox.UseVisualStyleBackColor = true;
            IsPreciseCheckbox.Visible = false;
            IsPreciseCheckbox.CheckedChanged += IsPreciseCheckbox_CheckedChange;
            // 
            // SuggestedTypeLabel
            // 
            SuggestedTypeLabel.AutoSize = true;
            SuggestedTypeLabel.Font = new Font("Segoe UI", 15F, FontStyle.Bold);
            SuggestedTypeLabel.Location = new Point(143, 436);
            SuggestedTypeLabel.Name = "SuggestedTypeLabel";
            SuggestedTypeLabel.Size = new Size(238, 41);
            SuggestedTypeLabel.TabIndex = 7;
            SuggestedTypeLabel.Text = "Suggested type";
            // 
            // SuggestedType
            // 
            SuggestedType.AutoSize = true;
            SuggestedType.Font = new Font("Segoe UI", 15F, FontStyle.Bold);
            SuggestedType.Location = new Point(455, 436);
            SuggestedType.Name = "SuggestedType";
            SuggestedType.Size = new Size(0, 41);
            SuggestedType.TabIndex = 8;
            // 
            // MainForm
            // 
            AutoScaleDimensions = new SizeF(10F, 25F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(1131, 579);
            Controls.Add(SuggestedType);
            Controls.Add(SuggestedTypeLabel);
            Controls.Add(IsPreciseCheckbox);
            Controls.Add(MaxValueLabel);
            Controls.Add(MaxValueTextBox);
            Controls.Add(MinValueTextBox);
            Controls.Add(IsFloatCheckbox);
            Controls.Add(MinValueLabel);
            Name = "MainForm";
            Text = "Numeric Types Suggester";
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private Label MinValueLabel;
        private CheckBox IsFloatCheckbox;
        private TextBox MinValueTextBox;
        private TextBox MaxValueTextBox;
        private Label MaxValueLabel;
        private CheckBox IsPreciseCheckbox;
        private Label SuggestedTypeLabel;
        private Label SuggestedType;
    }
}
