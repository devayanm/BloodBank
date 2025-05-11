import { useState } from 'react';
import { Input, Button, Form } from 'antd';
import styles from '../styles/DonorForm.module.css';

function DonorForm() {
    const [form, setForm] = useState({
        name: '',
        bloodType: '',
        location: '',
        contact: '',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Donor Data:', form);
        alert('Thank you for registering as a donor!');
        setForm({ name: '', bloodType: '', location: '', contact: '' });
    };

    return (
        <Form
            className={styles.form}
            onFinish={handleSubmit}
            layout="vertical"
            initialValues={form}
        >
            <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter your name!' }]}
            >
                <Input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                />
            </Form.Item>

            <Form.Item
                name="bloodType"
                label="Blood Type"
                rules={[{ required: true, message: 'Please enter your blood type!' }]}
            >
                <Input
                    type="text"
                    name="bloodType"
                    value={form.bloodType}
                    onChange={handleChange}
                    placeholder="Enter your blood type (e.g., A+, O-)"
                />
            </Form.Item>

            <Form.Item
                name="location"
                label="Location"
                rules={[{ required: true, message: 'Please enter your location!' }]}
            >
                <Input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Enter your location"
                />
            </Form.Item>

            <Form.Item
                name="contact"
                label="Contact Info"
                rules={[{ required: true, message: 'Please enter your contact info!' }]}
            >
                <Input
                    type="text"
                    name="contact"
                    value={form.contact}
                    onChange={handleChange}
                    placeholder="Enter your contact information"
                />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" block>
                    Register
                </Button>
            </Form.Item>
        </Form>
    );
}

export default DonorForm;
