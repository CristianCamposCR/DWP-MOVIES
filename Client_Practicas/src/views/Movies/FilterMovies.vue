<template>
  <div>
    <b-modal
        id="modal-filter-movie"
        ref="modal-filter-movie"
        title="Filtro"
        centered
        @hidden="cleanForm"
        @close="cleanForm"
        size="sm"
        hide-footer
        :no-close-on-backdrop="true"
    >
      <b-form ref="form" @submit.stop.prevent="handleOk">

        <b-row>
          <b-col>
            <b-form-group label="Selecciona una opción" v-slot="{ ariaDescribedby }">
              <b-form-radio v-model="filter.selectedOption" value="titleMovie">Por Nombre de pelicula</b-form-radio>
              <b-form-radio v-model="filter.selectedOption" value="nameDirector">Por Nombre del director</b-form-radio>
              <b-form-radio v-model="filter.selectedOption" value="datesBetween">Por intervalo de fechas de publicación
              </b-form-radio>
              <b-form-radio v-model="filter.selectedOption" value="category">Por categoria</b-form-radio>
              <b-form-radio v-model="filter.selectedOption" value="date">Por fecha de publicación</b-form-radio>
            </b-form-group>
          </b-col>
        </b-row>
        <hr>

        <section v-if="filter.selectedOption === 'titleMovie' || filter.selectedOption === 'nameDirector'">
          <b-row>
            <b-col>
              <b-form-group>
                <label for="value">Valor:&nbsp;<b class="text-danger">*</b></label>
                <b-form-input
                    id="value"
                    type="text"
                    placeholder="Ingresa el valor"
                    v-model="v$.filter.value.$model"
                    @blur="v$.filter.value.$touch"
                    :state=" v$.filter.value.$dirty ? !v$.filter.value.$error : null"
                >
                </b-form-input>
                <b-form-invalid-feedback v-if="v$.filter.value.$error">Campo obligatorio</b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
        </section>
        <section v-if="filter.selectedOption === 'category'">
          <b-row>
            <b-col cols="12" sm="12">
              <b-form-group>
                <label for="description">Categoria:&nbsp;<b class="text-danger">*</b></label>
                <b-form-select
                    v-model="v$.filter.value.$model"
                    :options="categoryList"
                    @blur="v$.filter.value.$touch"
                    :state=" v$.filter.value.$dirty ? !v$.filter.value.$error : null"
                >
                  <template #first>
                    <b-form-select-option :value="null" disabled>-- Selecciona una opción --</b-form-select-option>
                  </template>
                </b-form-select>
                <b-form-invalid-feedback v-if="v$.filter.value.$error">Campo obligatorio</b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
        </section>
        <section v-if="filter.selectedOption === 'datesBetween'">
          <b-row>
            <b-col cols="12" class="my-3">
              <b-form-group>
                <label for="atPublish">
                  Fecha inicio:&nbsp;<b class="text-danger">*</b></label
                >
                <b-form-datepicker
                    label-no-date-selected="Selecciona una fecha"
                    id="atPublish"
                    v-model="v$.filter.dates.start.$model"
                    class="mb-2"
                    @blur="v$.filter.dates.start.$touch"
                    :state=" v$.filter.dates.start.$dirty ? !v$.filter.dates.start.$error : null"
                ></b-form-datepicker>
                <b-form-invalid-feedback v-if="v$.filter.dates.start.$error">Campo obligatorio</b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group>
                <label for="atPublish">
                  Fecha fin:&nbsp;<b class="text-danger">*</b></label
                >
                <b-form-datepicker
                    id="atPublish"
                    label-no-date-selected="Selecciona una fecha"
                    v-model="v$.filter.dates.end.$model"
                    class="mb-2"
                    @blur="v$.filter.dates.end.$touch"
                    :state=" v$.filter.dates.end.$dirty ? !v$.filter.dates.end.$error : null"
                ></b-form-datepicker>
                <b-form-invalid-feedback v-if="v$.filter.dates.end.$error">Campo obligatorio</b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
        </section>
        <section v-if="filter.selectedOption === 'date'">
          <b-row>
            <b-col cols="12" class="my-3">
              <b-form-group>
                <label for="atPublish">
                  Fecha de publicación:&nbsp;<b class="text-danger">*</b></label
                >
                <b-form-datepicker
                    label-no-date-selected="Selecciona una fecha"
                    id="atPublish"
                    v-model="v$.filter.value.$model"
                    class="mb-2"
                    @blur="v$.filter.value.$touch"
                    :state=" v$.filter.value.$dirty ? !v$.filter.value.$error : null"
                ></b-form-datepicker>
                <b-form-invalid-feedback v-if="v$.filter.value.$error">Campo obligatorio</b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
        </section>


        <div class="col-12 mt-3 px-0 text-right">
          <b-button variant="outline-danger" @click="closeModal">Cancelar</b-button>
          <b-button variant="success" class="ml-2" type="submit" :disabled="v$.filter.value.$invalid && v$.filter.dates.$invalid">Guardar
          </b-button>
        </div>
      </b-form>

    </b-modal>
  </div>
</template>

<script>
import Vue from "vue";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import Axios from "axios";

export default Vue.extend({
  name: "filter-movie",
  setup() {return {v$: useVuelidate()};},
  props: {
    filter: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      option: "",
      categoryList: [],
    };
  },
  watch: {
    "filter.selectedOption": function (val) {
      if (val === "category") {
        this.filter.value = null;
        this.getCategories();
      }else{
        this.filter.value = "";
        this.v$.filter.value.$reset();
        this.filter.dates.start = "";
        this.v$.filter.dates.start.$reset();
        this.filter.dates.end = "";
        this.v$.filter.dates.end.$reset();
      }
    },
  },
  methods: {
    async getCategories() {
      try {
        const response = await Axios.get("http://localhost:8080/api/category/");
        this.categoryList = response.data.content.map((element) => ({
          text: element.name,
          value: element.id,
        }));
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    cleanForm() {
      this.filter.value = "";
      this.v$.filter.$reset();
    },
    makeToast() {
      this.$bvToast.toast("Registro exitoso", {
        title: `Éxito`,
        variant: "success",
        solid: true,
      });
    },
    closeModal() {
      this.$bvModal.hide("modal-filter-movie");
    },
    handleOk() {
      this.$emit("reload");
      this.closeModal();
    },
  },
  validations: {
    filter:{
      value: {
        required,
      },
      dates:{
        start: {
          required,
        },
        end: {
          required,
        }
      }
    },
  },
});



</script>