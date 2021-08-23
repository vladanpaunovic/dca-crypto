export const AdBannerBig = () => {
  return (
    <div className="border-4">
      <script async src="https://coinzillatag.com/lib/display.js" />
      <div className="coinzilla" data-zone="C-14160f92ec110283428" />

      <script
        dangerouslySetInnerHTML={{
          __html: `
        window.coinzilla_display = window.coinzilla_display || []; var
        c_display_preferences = {}; c_display_preferences.zone =
        "14160f92ec110283428"; c_display_preferences.width = "728";
        c_display_preferences.height = "90";
        coinzilla_display.push(c_display_preferences);
        `,
        }}
      />
    </div>
  );
};

export const AdBannerMedium = () => {
  return (
    <div className="border-4">
      <script async src="https://coinzillatag.com/lib/display.js" />
      <div className="coinzilla" data-zone="C-80660f92ec10f888819" />

      <script
        dangerouslySetInnerHTML={{
          __html: `
          window.coinzilla_display = window.coinzilla_display || [];
          var c_display_preferences = {};
          c_display_preferences.zone = "80660f92ec10f888819";
          c_display_preferences.width = "300";
          c_display_preferences.height = "250";
          coinzilla_display.push(c_display_preferences);
        `,
        }}
      />
    </div>
  );
};
