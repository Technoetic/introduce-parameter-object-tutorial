export default {
  extends: ["stylelint-config-standard"],
  rules: {
    "custom-property-pattern": null,
    "no-descending-specificity": null,
    "selector-class-pattern": null,
    "declaration-property-value-disallowed-list": {
      "font-family": ["/Inter/", "/Roboto/", "/Arial/"],
    },
  },
};
