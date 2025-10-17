"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({ name: "", email: "", phone: "", message: "" });
    alert("Thank you for reaching out! We'll be in touch soon.");
  };

  return (
    <section className="py-16 md:py-24 bg-background" id="contact">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
            Hubungi Kami
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Punya pertanyaan? Kami senang mendengarnya. Kirim pesan dan kami
            akan merespons secepatnya.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <Mail className="w-6 h-6 text-primary mb-2" />
                <CardTitle>Email</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">support@mindfulcare.com</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <Phone className="w-6 h-6 text-primary mb-2" />
                <CardTitle>Telepon</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">(555) 123-4567</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <MapPin className="w-6 h-6 text-primary mb-2" />
                <CardTitle>Alamat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Jl. Kesejahteraan 123
                  <br />
                  Kota Sehat, HC 12345
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Kirim Pesan</CardTitle>
                <CardDescription>
                  Isi formulir di bawah dan kami akan segera menghubungi Anda.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Nama
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Nama Anda"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="email@anda.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Telepon (Opsional)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="(081) 234-5678"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Pesan
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      placeholder="Ceritakan bagaimana kami bisa membantu..."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    Kirim Pesan
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
