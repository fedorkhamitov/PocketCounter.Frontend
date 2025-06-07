import { useState, useEffect } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import type { HumanName } from "../../types";
import { updateCustonerNameAndPhone } from "../../api";

interface EditCustomerNameProps {
  customerId: string;
  initialName: HumanName;
  initialPhone: string;
  onClose: () => void;
  onSave: () => void;
}

const EditCustomerName: React.FC<EditCustomerNameProps> = ({
  customerId,
  initialName,
  initialPhone,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState<HumanName>(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(initialName);
    setPhone(initialPhone);
  }, [initialName, initialPhone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Валидация обязательных полей
      if (!name.familyName.trim() || !name.firstName.trim()) {
        throw new Error("Фамилия и имя обязательны для заполнения");
      }

      await updateCustonerNameAndPhone(customerId, {
        fullName: {
          firstName: name.firstName.trim(),
          patronymic: name.patronymic.trim(),
          familyName: name.familyName.trim(),
        },
        phoneNumber: phone.trim(),
      });

      onSave(); // Уведомляем родительский компонент об успешном сохранении
      onClose(); // Закрываем форму редактирования
      window.location.href = "/orders";
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Неизвестная ошибка при сохранении"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded-3 bg-light">
      <h4 className="mb-4">Редактирование данных клиента</h4>
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Фамилия *</Form.Label>
          <Form.Control
            type="text"
            value={name.familyName}
            onChange={(e) => setName({ ...name, familyName: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Имя *</Form.Label>
          <Form.Control
            type="text"
            value={name.firstName}
            onChange={(e) => setName({ ...name, firstName: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Отчество</Form.Label>
          <Form.Control
            type="text"
            value={name.patronymic}
            onChange={(e) => setName({ ...name, patronymic: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Телефон</Form.Label>
          <Form.Control
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            pattern="\+?[0-9\s\-\(\)]+"
            placeholder="+7 (XXX) XXX-XX-XX"
          />
        </Form.Group>

        {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

        <div className="d-flex gap-2 justify-content-end">
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "Сохранение..." : "Сохранить"}
          </Button>
          
          <Button
            variant="outline-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Отмена
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditCustomerName;