<script setup>
</script>

<template>
  <div>
    <main>
      <router-view />
    </main>
  </div>
</template>

<style>
*,
*:before,
*:after {
  box-sizing: inherit;
}
a:focus,
a:active {
  outline: none;
}

a,
a:focus,
a:hover {
  cursor: pointer;
  color: inherit;
  text-decoration: none;
}

div:focus {
  outline: none;
}

html {
  height: 100%;
  box-sizing: border-box;
  scroll-behavior: smooth;
}
body {
  padding: 0;
  margin: 0;
  font-size: 16px;
  color: rgba(255, 255, 255);
  line-height: 1.7;
  font-family: "Open Sans", sans-serif;
  @apply bg-slate-700;
  height: 100vh;


}

.__bg{
  background-image: url('@/assets/images/bgcard.jpg');
  background-size: cover;
}

::v-deep .el-table--border{
    border-bottom: 1px solid #475569 !important;
    border-top: 1px solid #475569 !important;
    border-right:1px solid #475569 !important;
}

.pagination-control /deep/ .btn-prev,
.pagination-control /deep/ .number,
.pagination-control /deep/ .btn-next,
.pagination-control /deep/ .el-pagination__editor {
  min-width: 44px!important;
  width: 44px!important;
  height: 44px!important;
  border-radius: 12px!important;
  background-color: #fff!important;
  font-size: 16px!important;
  color: #969696!important;
  overflow: hidden;
}
.pagination-control /deep/ .number.is-active {
  background-color: #12BCFF!important;
  font-weight: normal!important;
  color: #fff!important;
}
.pagination-control /deep/ .el-input__wrapper {
  box-shadow: none!important;
}

</style>