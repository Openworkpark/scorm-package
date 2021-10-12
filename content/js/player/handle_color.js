var course_colors = {
    main_color: "",
    gradient_color: "",
    font_color: "",

    init: function() {
        course_colors.main_color = model.mainCourseColor;
        course_colors.lighterBGColor = model.lighterBGColor;
        course_colors.border_color = model.borderColor;
        course_colors.gradient_color = model.gradientColor;
        course_colors.gradientFontColor = model.gradientFontColor;
        course_colors.headingColor = model.headingcolor;
        course_colors.contentColor = model.contentcolor;
        course_colors.bgHover_color = model.gradientHover;
        course_colors.disabledColor = model.disabledColor;
        //console.log(course_colors.disabledColor.split(",")[0]);

        $("<style type='text/css'> .maincolor_theme, .ztree li a.curSelectedNode, .ui-widget-header { } " +
            //gradient color theme start
            ".ui-progress, .gradient_theme{ background-image:" + course_colors.main_color + ";" +
            "background:-webkit-linear-gradient(" + course_colors.gradient_color + ")" +
            "background:-moz-linear-gradient(" + course_colors.gradient_color + ");" +
            "background:-o-linear-gradient(" + course_colors.gradient_color + ");" +
            "background:-webkit-gradient(" + course_colors.gradient_color + ");" +
            "background:-ms-linear-gradient(" + course_colors.gradient_color + ");" +
            "background:linear-gradient(" + course_colors.gradient_color + ");"+
            "border-color:" + course_colors.border_color +";} " +
            ".gradient_theme:hover{ background:-webkit-linear-gradient(" + course_colors.bgHover_color + ")" +
            "background:-moz-linear-gradient(" + course_colors.bgHover_color + ");" +
            "background:-o-linear-gradient(" + course_colors.bgHover_color + ");" +
            "background:-webkit-gradient(" + course_colors.bgHover_color + ");" +
            "background:-ms-linear-gradient(" + course_colors.bgHover_color + ");" +
            "background:linear-gradient(" + course_colors.bgHover_color + ");} " +
            //disabled Color
            ".disabled{background:"+course_colors.disabledColor+ ";"+
            "background:-webkit-linear-gradient(" + course_colors.disabledColor + ");" +
            "background:-moz-linear-gradient(" + course_colors.disabledColor + ");" +
            "background:-o-linear-gradient(" + course_colors.disabledColor + ");" +
            "background:-webkit-gradient(" + course_colors.disabledColor + ");" +
            "background:-ms-linear-gradient(" + course_colors.disabledColor + ");" +
            "background:linear-gradient(" + course_colors.disabledColor + ");"+
            "border-color:" +course_colors.disabledColor.split(",")[0]+ "}"+
            ".disabled:hover{ background:-webkit-linear-gradient(" + course_colors.disabledColor + ")" +
            "background:-moz-linear-gradient(" + course_colors.disabledColor + ");" +
            "background:-o-linear-gradient(" + course_colors.disabledColor + ");" +
            "background:-webkit-gradient(" + course_colors.disabledColor + ");" +
            "background:-ms-linear-gradient(" + course_colors.disabledColor + ");" +
            "background:linear-gradient(" + course_colors.disabledColor + ");} " +
            //course font color
            ".fColor{ color : " + course_colors.gradientFontColor + ";} .hedFonColor{color: " + course_colors.headingColor + "} .bordColor, .ui-progress, .ui-widget-header, .ztree li a.curSelectedNode{ border-Color: " + course_colors.border_color + ";} " +
            //case study 1 css
            ".case_question{ background:" + course_colors.main_color + "} " +
            ".q_icon  { background:" + course_colors.lighterBGColor + "}" +
            "</style>").appendTo("head");
    }

};
