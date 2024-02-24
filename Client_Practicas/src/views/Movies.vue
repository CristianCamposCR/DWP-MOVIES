<template>
  <div style="height: 1000px">
    <b-overlay :show="isLoading" rounded="sm">
      <h5 v-show="showElement">
        Instrucciones: Para hacer el registro de una película primero llena
        todos los campos y luego arrastra desde cualquier lugar de la tarjeta de
        registro hacia la tarjeta donde se muestra el resto de películas
      </h5>
      <div class="mb-5" v-show="showElement">
        <b-card
          @dragover.prevent
          @dragenter.prevent
          @dragstart="startDrag($event)"
          draggable="true"
        >
          <h3 class="text-center my-5">Registro de películas</h3>
          <b-form ref="form" @submit.stop.prevent="saveMovie">
            <b-row>
              <b-col cols="12" sm="6">
                <b-form-group>
                  <label for="name">
                    Nombre de la película:&nbsp;<b class="text-danger"
                      >*</b
                    ></label
                  >
                  <b-form-input
                    id="name-input"
                    type="text"
                    placeholder="Ingresa el nombre"
                    v-model="v$.newMovie.title.$model"
                    @blur="v$.newMovie.title.$touch"
                    :state="
                      v$.newMovie.title.$dirty
                        ? !v$.newMovie.title.$error
                        : null
                    "
                  >
                  </b-form-input>
                  <b-form-invalid-feedback v-if="v$.newMovie.title.$error"
                    >Campo obligatorio</b-form-invalid-feedback
                  >
                </b-form-group>
              </b-col>
              <b-col cols="12" sm="6">
                <b-form-group>
                  <label for="description">
                    Descripción:&nbsp;<b class="text-danger">*</b></label
                  >
                  <b-form-input
                    id="description-input"
                    type="text"
                    placeholder="Ingresa la descripción"
                    v-model="v$.newMovie.description.$model"
                    @blur="v$.newMovie.description.$touch"
                    :state="
                      v$.newMovie.description.$dirty
                        ? !v$.newMovie.description.$error
                        : null
                    "
                  >
                  </b-form-input>
                  <b-form-invalid-feedback v-if="v$.newMovie.description.$error"
                    >Campo obligatorio</b-form-invalid-feedback
                  >
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="12" sm="6">
                <b-form-group>
                  <label for="director">
                    Nombre del director:&nbsp;<b class="text-danger"
                      >*</b
                    ></label
                  >
                  <b-form-input
                    id="director"
                    type="text"
                    placeholder="Ingresa el nombre"
                    v-model="v$.newMovie.director.$model"
                    @blur="v$.newMovie.director.$touch"
                    :state="
                      v$.newMovie.director.$dirty
                        ? !v$.newMovie.director.$error
                        : null
                    "
                  >
                  </b-form-input>
                  <b-form-invalid-feedback v-if="v$.newMovie.director.$error"
                    >Campo obligatorio</b-form-invalid-feedback
                  >
                </b-form-group>
              </b-col>
              <b-col cols="12" sm="6">
                <b-form-group>
                  <label for="atPublish">
                    Fecha de publicación:&nbsp;<b class="text-danger"
                      >*</b
                    ></label
                  >
                  <b-form-datepicker
                    id="atPublish"
                    v-model="v$.newMovie.atPublish.$model"
                    class="mb-2"
                    @blur="v$.newMovie.atPublish.$touch"
                    :state="
                      v$.newMovie.atPublish.$dirty
                        ? !v$.newMovie.atPublish.$error
                        : null
                    "
                  ></b-form-datepicker>
                  <b-form-invalid-feedback v-if="v$.newMovie.atPublish.$error"
                    >Campo obligatorio</b-form-invalid-feedback
                  >
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="12" sm="12">
                <b-form-group>
                  <label for="description">
                    Categoria:&nbsp;<b class="text-danger">*</b></label
                  >
                  <b-form-select
                    v-model="v$.newMovie.category.id.$model"
                    :options="options"
                    @blur="v$.newMovie.category.id.$touch"
                    :state="
                      v$.newMovie.category.id.$dirty
                        ? !v$.newMovie.category.id.$error
                        : null
                    "
                  ></b-form-select>
                  <b-form-invalid-feedback v-if="v$.newMovie.category.id.$error"
                    >Campo obligatorio</b-form-invalid-feedback
                  >
                </b-form-group>
              </b-col>
            </b-row>
          </b-form>
        </b-card>
      </div>

      <div>
        <b-card @drop="onDrop($event)" @dragover.prevent @dragenter.prevent>
          <b-row class="justify-content-end">
            <b-col cols="12" sm="auto">
              <b-button variant="outline-primary" v-b-modal.modal-filter-movie
                >Filtros</b-button
              >
              <b-button
                variant="success"
                class="ml-3"
                v-b-modal.modal-save-movie
                >Registrar</b-button
              >
            </b-col>
          </b-row>
          <!-- <TransitionGroup name="bounce" tag="div" class="list-group">
            <li v-for="item in movies" class="list-group-item" :key="item.id">
              {{ item.title }}
            </li>
          </TransitionGroup> -->
          <b-row
            cols="12"
            class="align-items-stretch"
            v-if="movies.length != 0"
          >
            <TransitionGroup
              name="rotate"
              tag="div"
              class="d-flex flex-row flex-wrap"
            >
              <b-col
                
                v-for="movie in movies"
                :key="movie.id"
                class="my-2"
              >
                <b-card
                  :title="movie.title"
                  img-src="https://picsum.photos/id/870/600/400?grayscale&blur=2"
                  img-alt="Image"
                  img-top
                  tag="article"
                  style="max-width: 20rem"
                  class="my-3 h-100"
                >
                  <b-card-text>
                    <p>Descripción: {{ movie.description }}</p>
                    <p>Director: {{ movie.director }}</p>
                    <p>Genero: {{ movie.category.name }}</p>
                    <p>Fecha de publicación: {{ movie.atPublish }}</p>
                  </b-card-text>
                  <b-row>
                    <b-col cols="12" sm="12">
                      <b-button
                        variant="danger"
                        block
                        v-b-tooltip.hover
                        title="Desactivar"
                        v-if="movie.status == true"
                        @click="changeStatus(movie)"
                      >
                        <b-icon icon="arrow-down"></b-icon>
                      </b-button>
                      <b-button
                        variant="success"
                        block
                        v-b-tooltip.hover
                        title="Activar"
                        v-else
                        @click="changeStatus(movie)"
                      >
                        <b-icon icon="arrow-up"></b-icon>
                      </b-button>
                    </b-col>
                    <b-col cols="12" sm="12" class="mt-2">
                      <b-button
                        variant="info"
                        block
                        v-b-tooltip.hover
                        title="Actualizar"
                        @click="onRecordSelected(movie)"
                        >Actualizar
                      </b-button>
                    </b-col>
                  </b-row>
                </b-card>
              </b-col>
            </TransitionGroup>
          </b-row>
          <b-row v-else-if="movies.length == 0 && !isLoading">
            <b-col cols="12" sm="12" class="text-center">
              <h3>Sin registros</h3>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <div class="mt-3">
                <b-pagination
                  v-model="currentPage"
                  pills
                  :total-rows="totalRows"
                  :per-page="perPage"
                  @input="handleMovies"
                ></b-pagination>
              </div>
            </b-col>
          </b-row>
        </b-card>
      </div>
      <SaveMovie @reload="handleMovies" />
      <UpdateMovie :item="recordForUpdate" @reload="handleMovies" />
      <FilterMovies :filter="filter" @reload="handleMovies" />
    </b-overlay>
  </div>
</template>
<script>
import Vue from "vue";
import Axios from "axios";
import SaveMovie from "../views/SaveMovie.vue";
import UpdateMovie from "../views/UpdateMovie.vue";
import FilterMovies from "@/views/Movies/FilterMovies.vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import {
  getMoviesByBetweenDates,
  getMoviesByCategory,
  getMoviesByDate,
  getMoviesByDirectorName,
  getMoviesByTitle,
} from "@/views/Movies/movie.gateway";

export default Vue.extend({
  name: "Movies",
  components: {
    SaveMovie,
    UpdateMovie,
    FilterMovies,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      showElement: true,
      movies: [],
      isLoading: false,
      currentPage: 1,
      perPage: 4,
      totalRows: 0,
      recordForUpdate: {},

      filter: {
        value: "",
        selectedOption: "",
        dates: {
          start: "",
          end: "",
        },
      },

      pageable: {
        currentPage: 1,
        sort: "id",
        direction: "asc",
        page: 0,
        size: 4,
      },
      newMovie: {
        title: "",
        description: "",
        image: "",
        director: "",
        atPublish: "",
        category: {
          id: null,
        },
      },
      selected: null,
      options: [],
    };
  },
  mounted() {
    this.handleMovies();
    this.getCategories();
    window.addEventListener("scroll", this.onScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll);
  },
  methods: {
    startDrag(evt) {
      evt.dataTransfer.dropEffect = "move";
      evt.dataTransfer.effectAllowed = "move";
      // evt.dataTransfer.setData("newMovie", newMovie);
    },
    onDrop() {
      if (
        !this.newMovie.title ||
        !this.newMovie.description ||
        !this.newMovie.director ||
        !this.newMovie.atPublish ||
        !this.newMovie.category.id
      ) {
        this.$swal.fire({
          title: "Cuidado",
          text: "Primero llena todos los campos",
          icon: "warning",
          confirmButtonText: "Aceptar",
        });
      } else {
        this.saveMovie();
      }
    },
    makeToast() {
      this.$bvToast.toast("Cambio de estado exitoso", {
        title: `Éxito`,
        variant: "success",
        solid: true,
      });
    },
    onRecordSelected(item) {
      this.recordForUpdate = { ...item };
      this.$bvModal.show("modal-update-movie");
    },

    async getMovies(pageable) {
      try {
        this.isLoading = true;
        const response = await Axios.get(
          `http://localhost:8080/api/movie/${pageable}`
        );
        this.totalRows = response.data.totalElements;
        this.movies = response.data.content;
      } catch (error) {
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async getMoviesByTittle(pageable) {
      try {
        this.isLoading = true;
        const data = await getMoviesByTitle(this.filter.value, pageable);
        this.totalRows = data.totalElements;
        this.movies = data.content;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
    async getMoviesByDirector(pageable) {
      try {
        this.isLoading = true;
        const data = await getMoviesByDirectorName(this.filter.value, pageable);
        this.totalRows = data.totalElements;
        this.movies = data.content;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
    async getMoviesByDatesPeriods(pageable) {
      try {
        this.isLoading = true;
        const data = await getMoviesByBetweenDates(
          this.filter.dates.start,
          this.filter.dates.end,
          pageable
        );
        this.totalRows = data.totalElements;
        this.movies = data.content;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
    async getMoviesByCategory(pageable) {
      try {
        this.isLoading = true;
        const data = await getMoviesByCategory(this.filter.value, pageable);
        this.totalRows = data.totalElements;
        this.movies = data.content;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
    async getMoviesByAtPublishDesc(pageable) {
      try {
        this.isLoading = true;
        const data = await getMoviesByDate(this.filter.dates.start, pageable);
        this.totalRows = data.totalElements;
        this.movies = data.content;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },

    async changeStatus(item) {
      try {
        this.$swal
          .fire({
            title: "Cuidado",
            text: "¿Seguro que desea realizar la acción?",
            icon: "question",
            confirmButtonText: "Aceptar",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
          })
          .then(async (result) => {
            if (result.isConfirmed) {
              this.isLoading = true;
              const response = await Axios.patch(
                `http://localhost:8080/api/movie/change-status/${item.id}`
              );
              this.handleMovies();
              this.makeToast();
            }
          });
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
    handleMovies() {
      const pageable = `?page=${this.currentPage - 1}&size=${this.perPage}`;
      console.log(
        this.filter.selectedOption,
        this.filter.value,
        this.filter.dates.start,
        this.filter.dates.end
      );
      switch (this.filter.selectedOption) {
        case "titleMovie":
          this.getMoviesByTittle(pageable);
          break;
        case "nameDirector":
          this.getMoviesByDirector(pageable);
          break;
        case "datesBetween":
          this.getMoviesByDatesPeriods(pageable);
          break;
        case "category":
          this.getMoviesByCategory(pageable);
          break;
        case "date":
          this.getMoviesByAtPublishDesc(pageable);
          break;
        default:
          this.getMovies(pageable);
      }
    },

    async getCategories() {
      try {
        const response = await Axios.get("http://localhost:8080/api/category/");
        this.options = response.data.content.map((element) => ({
          text: element.name,
          value: element.id,
        }));
        this.options.push({ value: null, text: "Selecciona una opción" });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async saveMovie() {
      try {
        this.$swal
          .fire({
            title: "Cuidado",
            text: "¿Seguro que desea realizar la acción?",
            icon: "question",
            confirmButtonText: "Aceptar",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
          })
          .then(async (result) => {
            if (result.isConfirmed) {
              console.log(this.newMovie);
              const response = await Axios.post(
                "http://localhost:8080/api/movie/",
                this.newMovie
              );
              console.log(response);
              // this.$emit("reload");
              // this.$nextTick(() => this.$bvModal.hide("modal-save-movie"));
              this.handleMovies();
              this.cleanForm();
              this.makeToast2();
              return response.data;
            }
          });
      } catch (error) {
        throw error;
      }
    },
    cleanForm() {
      this.newMovie = {
        title: "",
        description: "",
        image: "",
        director: "",
        atPublish: "",
        category: {
          id: null,
        },
      };
      this.selected = null;
      this.v$.newMovie.$reset();
    },
    handleOk(bvModalEvent) {
      bvModalEvent.preventDefault();
      this.saveMovie();
    },
    makeToast2() {
      this.$bvToast.toast("Registro exitoso", {
        title: `Éxito`,
        variant: "success",
        solid: true,
      });
    },

    onScroll() {
      // Obtiene la posición actual del scroll
      const currentScrollPosition =
        window.pageYOffset || document.documentElement.scrollTop;
      console.log(currentScrollPosition);
      if (Math.abs(currentScrollPosition) > 5) {
        console.log("pasa de 700");
        this.showElement = false;
      } else if (Math.abs(currentScrollPosition) < 5) {
        console.log("menor de 700");
        this.showElement = true;
      }
      // this.lastScrollPosition = currentScrollPosition;

      // La función abs para tener valores absolutos y se delimita con un offset o bien llamado
      // margen para que el valor de la posición sea después de desplazarce y no desde que uno se desplaza
      // if (Math.abs(currentScrollPosition - this.lastScrollPosition) < 1000000) {
      //   return;
      // }
      // aqui determinamos si la posición es mayor a la posición anterior. Entonces, si lo es, mostramos el elemento.
      // this.showElement = currentScrollPosition < this.lastScrollPosition;
      //
      // this.lastScrollPosition = currentScrollPosition;
    },
  },

  validations() {
    return {
      newMovie: {
        title: {
          required,
        },
        description: {
          required,
        },
        atPublish: {
          required,
        },
        director: {
          required,
        },
        category: {
          id: {
            required,
          },
        },
      },
    };
  },
});
</script>
