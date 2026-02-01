<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
const router = useRouter();
const authStore = useAuthStore();
const isLogin = ref(true);
const loading = ref(false);
const error = ref('');
const form = reactive({
  name: '',
  email: '',
  password: '',
});
const toggleMode = () => {
  isLogin.value = !isLogin.value;
  error.value = '';
  form.name = '';
  form.email = '';
  form.password = '';
};
const handleSubmit = async () => {
  loading.value = true;
  error.value = '';
  try {
    if (isLogin.value) {
      await authStore.login({
        email: form.email,
        password: form.password,
      });
    } else {
      await authStore.register({
        name: form.name,
        email: form.email,
        password: form.password,
      });
    }
    router.push('/');
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>
<template>
  <div class="login-page">
    <div class="login-card">
      <div class="card-header">
        <h1>MovieBox</h1>
        <p>{{ isLogin ? 'Entre na sua conta' : 'Crie sua conta' }}</p>
      </div>
      <form @submit.prevent="handleSubmit" class="form">
        <div v-if="!isLogin" class="form-group">
          <label>Nome Completo</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Digite seu nome"
            required
          />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="seu@email.com"
            required
          />
        </div>
        <div class="form-group">
          <label>Senha</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        <button type="submit" :disabled="loading" class="btn-submit">
          {{ loading ? 'Carregando...' : isLogin ? 'Entrar' : 'Cadastrar' }}
        </button>
      </form>
      <div class="toggle">
        <p>
          {{ isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?' }}
          <a @click="toggleMode" class="toggle-link">
            {{ isLogin ? 'Cadastre-se' : 'Faça login' }}
          </a>
        </p>
      </div>
    </div>
  </div>
</template>
<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}
.login-card {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
}
.card-header {
  text-align: center;
  margin-bottom: 30px;
}
.card-header h1 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 28px;
}
.card-header p {
  color: #7f8c8d;
  margin: 0;
  font-size: 16px;
}
.form {
  margin-bottom: 20px;
}
.form-group {
  margin-bottom: 20px;
}
label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
}
.btn-submit {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 16px;
  margin-top: 10px;
}
.btn-submit:hover:not(:disabled) {
  background: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
}
.error-message {
  background: #fee;
  color: #e74c3c;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 15px;
  text-align: center;
  font-size: 14px;
  border: 1px solid #e74c3c;
}
.toggle {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #ecf0f1;
}
.toggle p {
  color: #7f8c8d;
  margin: 0;
  font-size: 14px;
}
.toggle-link {
  color: #667eea;
  cursor: pointer;
  font-weight: 600;
  margin-left: 5px;
}
.toggle-link:hover {
  text-decoration: underline;
}
</style>
