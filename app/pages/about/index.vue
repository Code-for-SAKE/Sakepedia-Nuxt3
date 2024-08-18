<template>
  <div>
    <h1>{{ $t("makingOpenData4Sake") }}</h1>
    {{ $t("explainAbout") }}

    <h3>{{ $t("functions") }}</h3>
    <ul>
      <li>{{ $t("function1") }}</li>
      <ul>
        <li>{{ $t("sake") }}</li>
        <li>{{ $t("brand") }}</li>
        <li>{{ $t("brewery") }}</li>
      </ul>
      <li>{{ $t("function2") }}</li>
    </ul>

    <h3>{{ $t("devInfo") }}</h3>

    <ul>
      <li>
        {{ $t("explainBase") }}
        <a
          href="http://idea.linkdata.org/idea/idea1s2029i"
          >Sakepedia</a
        >
      </li>
      <li>{{ $t("explainOSS") }}</li>
      <ul>
        <li>{{ $t("developer") }} : <a href="https://www.code4sake.org/">Code for SAKE</a></li>
        <li>{{ $t("repository") }} : <a href="https://github.com/Code-for-SAKE/Sakepedia-Nuxt">Github</a></li>
      </ul>
    </ul>
  </div>
</template>
