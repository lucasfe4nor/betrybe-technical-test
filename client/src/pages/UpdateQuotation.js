import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loader from 'react-loader-spinner';

import { NEW_QUOTATION, CURRENT_QUOTATION } from '../services/api.js';
import Input from '../components/Form/Input';
import Button from '../components/Form/Button';

import style from './UpdateQuotation.module.css';

export default function UpdateQuotation() {
  const [quotation, setQuotation] = React.useState('BRL');
  const [currentQuotation, setCurrentQuotation] = React.useState(null);
  const [valueCurrency, setValueCurrency] = React.useState('');
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setError(null);
      setLoading(true);

      const { url, options } = NEW_QUOTATION({
        currency: quotation,
        value: valueCurrency,
      });
      const res = await fetch(url, options);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message);
      }

      navigate('/');
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  }

  React.useEffect(() => {
    async function getCurrentQuotation() {
      const { url, options } = CURRENT_QUOTATION();
      const res = await fetch(url, options);
      if (res.ok) {
        const json = await res.json();
        setCurrentQuotation(json);
      }
    }
    getCurrentQuotation();

    return () => {
      setError(null);
      setLoading(false);
    };
  }, []);

  return (
    <section className={style.wrapper}>
      <Link to="/">
        <Button>Voltar</Button>
      </Link>

      <label htmlFor="currencies">Moeda</label>
      <select
        name="currencies"
        id="currencies"
        value={quotation}
        onChange={({ target }) => setQuotation(target.value)}
      >
        <option value="BRL">BRL</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
      </select>

      {currentQuotation ? (
        <div>Valor atual: {currentQuotation[quotation]}</div>
      ) : (
        <Loader type="Oval" color="black" height={40} width={40} />
      )}

      <form onSubmit={handleSubmit}>
        <Input
          label="Novo valor"
          type="number"
          name="currency"
          value={valueCurrency}
          onChange={({ target }) => {
            setValueCurrency(target.value);
          }}
          min="0"
        />

        {!loading ? (
          <Button>Atualizar</Button>
        ) : (
          <Button disabled>Atualizar</Button>
        )}

        {error && <div className="error">{error}</div>}
      </form>
    </section>
  );
}
