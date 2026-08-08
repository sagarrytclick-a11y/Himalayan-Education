import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    
    const skip = (page - 1) * limit;
    
    let query: any = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { courseInterest: { $regex: search, $options: 'i' } },
      ];
    }
    
    const enquiries = await Enquiry.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Enquiry.countDocuments(query);
    
    return NextResponse.json({
      enquiries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch enquiries',
        enquiries: [],
        pagination: { page: 1, limit: 10, total: 0, pages: 0 },
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    await connectDB();
    
    const body = await request.json();
    const { id, status, notes } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Enquiry ID is required' },
        { status: 400 }
      );
    }
    
    const updateData: any = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    
    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    if (!enquiry) {
      return NextResponse.json(
        { error: 'Enquiry not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(enquiry);
  } catch (error) {
    console.error('Error updating enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to update enquiry' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    await connectDB();

    const { searchParams } = request.nextUrl;
    let targetId = (searchParams.get("id") || "").trim();

    if (!targetId) {
      try {
        const body = await request.json();
        targetId = String(body?.id || "").trim();
      } catch {
        /* no body */
      }
    }

    if (!targetId) {
      return NextResponse.json(
        { error: "Enquiry ID is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      return NextResponse.json(
        { error: "Invalid enquiry ID" },
        { status: 400 }
      );
    }

    const enquiry = await Enquiry.findByIdAndDelete(targetId);

    // Already deleted → still success so UI can clear the row
    if (!enquiry) {
      return NextResponse.json(
        { message: "Enquiry already deleted", alreadyDeleted: true },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Enquiry deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting enquiry:", error);
    return NextResponse.json(
      { error: "Failed to delete enquiry" },
      { status: 500 }
    );
  }
}
