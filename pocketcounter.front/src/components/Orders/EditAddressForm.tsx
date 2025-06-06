import { useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import type { Address } from "../../types";
import { updateOrderAddress } from "../../api";

interface EditAddressFormProps {
  customerId: string;
  orderId: string;
  initialAddress?: Address;
  onClose: () => void;
  onSave: () => void;
}

const EditAddressForm: React.FC<EditAddressFormProps> = ({
  customerId,
  orderId,
  initialAddress,
  onClose,
  onSave,
}) => {
  const [address, setAddress] = useState<Address>(initialAddress || {
    zipCode: "",
    country: "",
    state: "",
    city: "",
    streetName: "",
    streetNumber: "",
    apartment: "",
    specialAddressString: ""
  });
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateOrderAddress(customerId, orderId, {
        address: address
      });

      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения адреса");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded-3 bg-light mb-4">
      <h5>Редактирование адреса доставки</h5>
      
      <Form onSubmit={handleSubmit}>
        <div className="row g-3">
          <Form.Group className="col-md-6">
            <Form.Label>Индекс</Form.Label>
            <Form.Control
              type="text"
              value={address.zipCode}
              onChange={(e) => setAddress({...address, zipCode: e.target.value})}
            />
          </Form.Group>

          <Form.Group className="col-md-6">
            <Form.Label>Страна</Form.Label>
            <Form.Control
              type="text"
              value={address.country}
              onChange={(e) => setAddress({...address, country: e.target.value})}
            />
          </Form.Group>

          <Form.Group className="col-md-6">
            <Form.Label>Область/Штат</Form.Label>
            <Form.Control
              type="text"
              value={address.state}
              onChange={(e) => setAddress({...address, state: e.target.value})}
            />
          </Form.Group>

          <Form.Group className="col-md-6">
            <Form.Label>Город</Form.Label>
            <Form.Control
              type="text"
              value={address.city}
              onChange={(e) => setAddress({...address, city: e.target.value})}
            />
          </Form.Group>

          <Form.Group className="col-md-8">
            <Form.Label>Улица</Form.Label>
            <Form.Control
              type="text"
              value={address.streetName}
              onChange={(e) => setAddress({...address, streetName: e.target.value})}
            />
          </Form.Group>

          <Form.Group className="col-md-2">
            <Form.Label>Дом</Form.Label>
            <Form.Control
              type="text"
              value={address.streetNumber}
              onChange={(e) => setAddress({...address, streetNumber: e.target.value})}
            />
          </Form.Group>

          <Form.Group className="col-md-2">
            <Form.Label>Квартира</Form.Label>
            <Form.Control
              type="text"
              value={address.apartment}
              onChange={(e) => setAddress({...address, apartment: e.target.value})}
            />
          </Form.Group>

          <Form.Group className="col-12">
            <Form.Label>Дополнительная информация</Form.Label>
            <Form.Control
              as="textarea"
              value={address.specialAddressString}
              onChange={(e) => setAddress({...address, specialAddressString: e.target.value})}
            />
          </Form.Group>
        </div>

        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

        <div className="d-flex gap-2 justify-content-end mt-4">
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "Сохранение..." : "Сохранить адрес"}
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

export default EditAddressForm;